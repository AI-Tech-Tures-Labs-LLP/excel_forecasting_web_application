import os
import time
import json 
import zipfile 

from django.conf import settings
from django.http import FileResponse
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status, viewsets
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny


from .models import ProductDetail, MonthlyForecast, StoreForecast, ComForecast, OmniForecast, ForecastNote
from .serializers import ProductDetailSerializer, MonthlyForecastSerializer, StoreForecastSerializer, ComForecastSerializer, OmniForecastSerializer, ForecastNoteSerializer
from .service.exportExcel import process_data

def make_zip_and_delete(folder_path):
    folder_path = os.path.normpath(folder_path)
    zip_file_path = os.path.normpath(f'{folder_path}.zip')
    
    try:
        # Create a ZIP file
        with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(folder_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, folder_path)  # Preserve folder structure
                    zipf.write(file_path, arcname)
        
        print(f"Folder '{folder_path}' has been compressed into '{zip_file_path}'")

        # # Delete the folder after zipping
        # shutil.rmtree(folder_path)
        # print(f"Folder '{folder_path}' has been deleted successfully.")
    
    except PermissionError:
        print(f"Permission denied: Cannot access '{folder_path}'. Please check folder permissions.")
    except FileNotFoundError:
        print(f"File not found: '{folder_path}' does not exist.")
    except Exception as e:
        print(f"An error occurred: {e}")
 

class UploadXlsxAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        output_folder = request.data.get('output_filename', '').strip()
        month_from = request.data.get('month_from')
        month_to = request.data.get('month_to')
        percentage = request.data.get('percentage')
        categories = request.data.get('categories')


        if not uploaded_file or not output_folder:
            return Response({'error': 'File or output folder not provided'}, status=status.HTTP_400_BAD_REQUEST)

        input_tuple = []
        if categories:
            input_tuple = [(item['name'], item['value']) for item in json.loads(categories)]

        processed_dir = os.path.join(settings.MEDIA_ROOT, 'processed_files')
        os.makedirs(processed_dir, exist_ok=True)
        output_folder_path = os.path.join(processed_dir, output_folder)
        os.makedirs(output_folder_path, exist_ok=True)

        # Save uploaded file into MEDIA_ROOT
        save_path = os.path.join(output_folder_path, uploaded_file.name)
        with open(save_path, 'wb+') as dest:
            for chunk in uploaded_file.chunks():
                dest.write(chunk)
        input_path = save_path

        try:
            start_time = time.time()
            process_data(input_path, output_folder_path, month_from, month_to, percentage, input_tuple)
            elapsed_time = time.time() - start_time
            print(f"Processing took {elapsed_time:.3f}s")
            make_zip_and_delete(output_folder_path)
        except Exception as e:
            return Response({'error': f'Processing error: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        zip_rel = f'processed_files/{output_folder}.zip'
        zip_url = request.build_absolute_uri(settings.MEDIA_URL + zip_rel)
        return Response({'file_url': zip_url}, status=status.HTTP_200_OK)


class DownloadFileAPIView(APIView):
    def get(self, request):
        file_path = request.query_params.get('file_path')

        if not file_path:
            return Response({'error': 'File path not provided'}, status=status.HTTP_400_BAD_REQUEST)

        full_file_path = os.path.join(settings.MEDIA_ROOT, file_path.replace(settings.MEDIA_URL, ''))

        if os.path.exists(full_file_path):
            return FileResponse(open(full_file_path, 'rb'), content_type='application/zip',
                                as_attachment=True, filename=os.path.basename(full_file_path))

        return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)


class ProductDetailViewSet(viewsets.ViewSet):
    def retrieve(self, request, pk=None):
        # Fetch product details
        product = get_object_or_404(ProductDetail, product_id=pk)
        product_serializer = ProductDetailSerializer(product)
        
        # Fetch forecasts
        forecasts = MonthlyForecast.objects.filter(product=product)
        forecast_serializer = MonthlyForecastSerializer(forecasts, many=True)
        
       # Fetch additional forecasts by pid
        store_forecasts = StoreForecast.objects.filter(pid=pk)
        store_serializer = StoreForecastSerializer(store_forecasts, many=True)

        com_forecasts = ComForecast.objects.filter(pid=pk)
        com_serializer = ComForecastSerializer(com_forecasts, many=True)

        omni_forecasts = OmniForecast.objects.filter(pid=pk)
        omni_serializer = OmniForecastSerializer(omni_forecasts, many=True)

        return Response({
            "product_details": product_serializer.data,
            "monthly_forecast": forecast_serializer.data,
            "store_forecast": store_serializer.data,
            "com_forecast": com_serializer.data,
            "omni_forecast": omni_serializer.data
        })
    
    def update(self, request, pk=None):
        # Fetch product details
        product = get_object_or_404(ProductDetail, product_id=pk)
        product_serializer = ProductDetailSerializer(product, data=request.data.get("product_details", {}), partial=True)
        
        if product_serializer.is_valid():
            product_serializer.save()
        else:
            return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Fetch and update forecasts
        forecast_data = request.data.get("monthly_forecast", [])
        for forecast in forecast_data:
            forecast_instance = MonthlyForecast.objects.filter(product=product, variable_name=forecast.get("variable_name"), year=forecast.get("year")).first()
            if forecast_instance:
                forecast_serializer = MonthlyForecastSerializer(forecast_instance, data=forecast, partial=True)
            else:
                forecast["product"] = product.product_id
                forecast_serializer = MonthlyForecastSerializer(data=forecast)
            
            if forecast_serializer.is_valid():
                forecast_serializer.save()
            else:
                return Response(forecast_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            "product_details": product_serializer.data,
            "monthly_forecast": MonthlyForecastSerializer(MonthlyForecast.objects.filter(product=product), many=True).data
        })




# class ForecastViewSet(ViewSet):

#     @action(detail=False, methods=["get"])
#     def filter_products(self, request):
#         categories     = request.query_params.getlist("category")      # multiple allowed
#         birthstones    = request.query_params.getlist("birthstone")    # multiple allowed
#         red_box_items  = request.query_params.getlist("red_box_item")  # multiple allowed now
#         vdf_statuses   = request.query_params.getlist("vdf_status")    # multiple allowed now
#         product_type   = request.query_params.get("product_type")

#         response = {}

#         if not product_type or product_type == "store":
#             store_qs = StoreForecast.objects.all()
#             if categories:
#                 store_qs = store_qs.filter(category__in=categories)
#             if birthstones:
#                 store_qs = store_qs.filter(birthstone__in=birthstones)
#             if red_box_items:
#                 # Convert string values to boolean and filter
#                 red_box_flags = [item.lower() == "true" for item in red_box_items]
#                 store_qs = store_qs.filter(red_box_item__in=red_box_flags)
#             response["store_products"] = StoreForecastSerializer(store_qs, many=True).data

#         if not product_type or product_type == "com":
#             com_qs = ComForecast.objects.all()
#             if categories:
#                 com_qs = com_qs.filter(category__in=categories)
#             if vdf_statuses:
#                 # Convert string values to boolean and filter
#                 vdf_flags = [status.lower() == "true" for status in vdf_statuses]
#                 com_qs = com_qs.filter(vdf_status__in=vdf_flags)
#             if red_box_items:
#                 # Add red_box_item filter for COM products if needed
#                 red_box_flags = [item.lower() == "true" for item in red_box_items]
#                 com_qs = com_qs.filter(red_box_item__in=red_box_flags)
#             response["com_products"] = ComForecastSerializer(com_qs, many=True).data

#         if not product_type or product_type == "omni":
#             omni_qs = OmniForecast.objects.all()
#             if categories:
#                 omni_qs = omni_qs.filter(category__in=categories)
#             if birthstones:
#                 omni_qs = omni_qs.filter(birthstone__in=birthstones)
#             if red_box_items:
#                 # Add red_box_item filter for Omni products if needed
#                 red_box_flags = [item.lower() == "true" for item in red_box_items]
#                 omni_qs = omni_qs.filter(red_box_item__in=red_box_flags)
#             response["omni_products"] = OmniForecastSerializer(omni_qs, many=True).data

#         all_pids = set()
#         for key in ["store_products", "com_products", "omni_products"]:
#             for item in response.get(key, []):
#                 all_pids.add(item["pid"])

#         # Fetch notes for those pids
#         notes = ForecastNote.objects.filter(pid__in=all_pids)
#         response["forecast_notes"] = ForecastNoteSerializer(notes, many=True).data

#         return Response(response)
class ForecastViewSet(ViewSet):

    @action(detail=False, methods=["get"])
    def filter_products(self, request):
        categories = request.query_params.getlist("category")
        birthstones = request.query_params.getlist("birthstone")
        red_box_items = request.query_params.getlist("red_box_item")
        vdf_statuses = request.query_params.getlist("vdf_status")
        product_type = request.query_params.get("product_type")

        # New filters
        considered_birthstone = request.query_params.get("considered_birthstone")
        added_qty_macys_soq = request.query_params.get("added_qty_macys_soq")
        below_min_order = request.query_params.get("below_min_order")
        over_macys_soq = request.query_params.get("over_macys_soq")
        added_only_to_balance_soq = request.query_params.get("added_only_to_balance_soq")
        need_to_review_first = request.query_params.get("need_to_review_first")
        holiday_filters = {
            "Valentine_day": request.query_params.get("valentine_day"),
            "Mothers_day": request.query_params.get("mothers_day"),
            "Fathers_day": request.query_params.get("fathers_day"),
            "Mens_day": request.query_params.get("mens_day"),
            "Womens_day": request.query_params.get("womens_day"),
        }

        response = {}

        def apply_common_filters(qs, model_name):
            if categories:
                qs = qs.filter(category__in=categories)
            if birthstones:
                qs = qs.filter(birthstone__in=birthstones)
            if red_box_items:
                red_box_flags = [item.lower() == "true" for item in red_box_items]
                qs = qs.filter(red_box_item__in=red_box_flags)
            if considered_birthstone is not None and model_name in ["store", "omni"]:
                qs = qs.filter(considered_birthstone_required_quantity=(considered_birthstone.lower() == "true"))
            if added_qty_macys_soq is not None:
                qs = qs.filter(Added_qty_using_macys_SOQ=(added_qty_macys_soq.lower() == "true"))
            if below_min_order is not None:
                qs = qs.filter(Below_min_order=(below_min_order.lower() == "true"))
            if over_macys_soq is not None:
                qs = qs.filter(Over_macys_SOQ=(over_macys_soq.lower() == "true"))
            if added_only_to_balance_soq is not None:
                qs = qs.filter(Added_only_to_balance_macys_SOQ=(added_only_to_balance_soq.lower() == "true"))
            if need_to_review_first is not None:
                qs = qs.filter(Need_to_review_first=(need_to_review_first.lower() == "true"))
            for field, value in holiday_filters.items():
                if value is not None:
                    qs = qs.filter(**{field: value.lower() == "true"})
            return qs


        if not product_type or product_type == "store":
            store_qs = apply_common_filters(StoreForecast.objects.all(), "store")
            response["store_products"] = StoreForecastSerializer(store_qs, many=True).data

        if not product_type or product_type == "com":
            com_qs = ComForecast.objects.all()
            if vdf_statuses:
                vdf_flags = [status.lower() == "true" for status in vdf_statuses]
                com_qs = com_qs.filter(vdf_status__in=vdf_flags)
            com_qs = apply_common_filters(com_qs, "com")
            response["com_products"] = ComForecastSerializer(com_qs, many=True).data

        if not product_type or product_type == "omni":
            omni_qs = apply_common_filters(OmniForecast.objects.all(), "omni")
            response["omni_products"] = OmniForecastSerializer(omni_qs, many=True).data


        all_pids = set()
        for key in ["store_products", "com_products", "omni_products"]:
            for item in response.get(key, []):
                all_pids.add(item["pid"])

        notes = ForecastNote.objects.filter(pid__in=all_pids)
        response["forecast_notes"] = ForecastNoteSerializer(notes, many=True).data

        return Response(response)


class DownloadForecastSummaryExcel(APIView):
    permission_classes = [AllowAny]  # Adjust if needed

    def get(self, request):
        file_path = os.path.join(settings.MEDIA_ROOT, "forecast_summaryfor_april_4.xlsx")
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename="forecast_summaryfor_april_4.xlsx")
        return Response({"detail": "File not found."}, status=404)

class ForecastNoteViewSet(viewsets.ModelViewSet):
    queryset = ForecastNote.objects.all().order_by('-updated_at')
    serializer_class = ForecastNoteSerializer


class StoreForecastViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StoreForecast.objects.all()
    serializer_class = StoreForecastSerializer


class ComForecastViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ComForecast.objects.all()
    serializer_class = ComForecastSerializer

class OmniForecastViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OmniForecast.objects.all()
    serializer_class = OmniForecastSerializer