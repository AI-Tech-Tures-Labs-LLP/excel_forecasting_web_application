import os
import time
import json 
import zipfile 
import io

from django.conf import settings
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, JsonResponse


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
from forecast.service.rollingfc import recalculate_all
from forecast.service.adddatabase import save_forecast_data

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

        notes     = ForecastNote.objects.filter(pid=pk)
        notes_serializer = ForecastNoteSerializer(notes, many=True)

        return Response({
            "product_details": product_serializer.data,
            "forecast_notes" : notes_serializer.data,
            "monthly_forecast": forecast_serializer.data,
            "store_forecast": store_serializer.data,
            "com_forecast": com_serializer.data,
            "omni_forecast": omni_serializer.data
        })
    

    def update(self, request, pk=None):
    # 1. Update ProductDetail
        product = get_object_or_404(ProductDetail, product_id=pk)
        product_serializer = ProductDetailSerializer(product, data=request.data.get("product_details", {}), partial=True)
        
        if product_serializer.is_valid():
            product_serializer.save()
        else:
            return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # 2. Update/Create MonthlyForecast
        forecast_data = request.data.get("monthly_forecast", [])
        for forecast in forecast_data:
            forecast_instance = MonthlyForecast.objects.filter(
                product=product,
                variable_name=forecast.get("variable_name"),
                year=forecast.get("year")
            ).first()

            if forecast_instance:
                forecast_serializer = MonthlyForecastSerializer(forecast_instance, data=forecast, partial=True)
            else:
                forecast["product"] = product.product_id
                forecast_serializer = MonthlyForecastSerializer(data=forecast)
            
            if forecast_serializer.is_valid():
                forecast_serializer.save()
            else:
                return Response(forecast_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # 3. Update/Create ForecastNote
        note_data = request.data.get("forecast_notes", [])
        for note in note_data:
            note_id = note.get("id")
            if note_id:
                note_instance = ForecastNote.objects.filter(id=note_id, pid=pk).first()
                if note_instance:
                    note_serializer = ForecastNoteSerializer(note_instance, data=note, partial=True)
                else:
                    continue  # Skip invalid IDs
            else:
                note["pid"] = pk
                note_serializer = ForecastNoteSerializer(data=note)
            
            if note_serializer.is_valid():
                note_serializer.save()
            else:
                return Response(note_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # 4. Return updated data
        return Response({
            "product_details": product_serializer.data,
            "monthly_forecast": MonthlyForecastSerializer(MonthlyForecast.objects.filter(product=product), many=True).data,
            "forecast_notes": ForecastNoteSerializer(ForecastNote.objects.filter(pid=pk), many=True).data,
        })
    

    @action(detail=False, methods=["post"])
    def recalculate_forecast(self, request):
        """
        POST /products/recalculate_forecast/

        {
          "changed_variable": "Planned_FC",
          "new_value": 150,
          "context_data": {
            "Forecasting_Method": "avg",
            "Index": 100,
            "12_month_FC": 200,
            ...
          },
          "pid": "P123"
        }
        """
        changed_variable = request.data.get("changed_variable")
        new_value = request.data.get("new_value")
        context_data = request.data.get("context_data")
        pid = request.data.get("pid")
        print("Changed Variable:", changed_variable)
        print("New Value:", new_value)
        print("Context Keys:", context_data.keys())
        print("PID:", pid)
        if not all([changed_variable, context_data, pid]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            updated_context = recalculate_all(changed_variable, new_value, context_data.copy(), pid)
            save_forecast_data(pid, updated_context)
            print("Rolling 12 FC updated to Database ")
            return Response({"updated_context": updated_context})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    





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

        all_pids = set()

        if not product_type or product_type == "store":
            store_qs = apply_common_filters(StoreForecast.objects.all(), "store")
            store_data = StoreForecastSerializer(store_qs, many=True).data
            response["store_products"] = store_data
            all_pids.update([item["pid"] for item in store_data])

        if not product_type or product_type == "com":
            com_qs = ComForecast.objects.all()
            if vdf_statuses:
                vdf_flags = [status.lower() == "true" for status in vdf_statuses]
                com_qs = com_qs.filter(vdf_status__in=vdf_flags)
            com_qs = apply_common_filters(com_qs, "com")
            com_data = ComForecastSerializer(com_qs, many=True).data
            response["com_products"] = com_data
            all_pids.update([item["pid"] for item in com_data])

        if not product_type or product_type == "omni":
            omni_qs = apply_common_filters(OmniForecast.objects.all(), "omni")
            omni_data = OmniForecastSerializer(omni_qs, many=True).data
            response["omni_products"] = omni_data
            all_pids.update([item["pid"] for item in omni_data])

        # Fetch and group forecast notes by pid
        notes = ForecastNote.objects.filter(pid__in=all_pids)
        notes_map = {}
        for note in ForecastNoteSerializer(notes, many=True).data:
            notes_map.setdefault(note["pid"], []).append(note)

        # Inject forecast_notes into each product
        for group in ["store_products", "com_products", "omni_products"]:
            for item in response.get(group, []):
                item["forecast_notes"] = notes_map.get(item["pid"], [])

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

        def get_queryset(self):
            queryset = super().get_queryset()
            pid = self.request.query_params.get('pid')
            if pid:
                queryset = queryset.filter(pid=pid)
            return queryset


class StoreForecastViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StoreForecast.objects.all()
    serializer_class = StoreForecastSerializer


class ComForecastViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ComForecast.objects.all()
    serializer_class = ComForecastSerializer

class OmniForecastViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OmniForecast.objects.all()
    serializer_class = OmniForecastSerializer



def download_category_sheet(request):
    """
    API view to download specific category sheets from Excel files.
    
    Query parameters:
    - category: Single category name or comma-separated list of categories
    
    Returns:
    - Single Excel file for download if one category is requested
    - Zip file containing multiple Excel files if multiple categories are requested
    - Error response if categories are not found or invalid
    category=Gold746,Diamond734%26737%26748&file_name=jkl
    """
    category_param = request.GET.get('category')
    file_path = request.GET.get('file_path','')

    if not category_param:
        return JsonResponse({'error': 'Category parameter is required'}, status=400)
    
    # Split the categories by comma to handle multiple categories
    categories = [cat.strip() for cat in category_param.split(',')]
    
    # Define the media directory path
    media_dir = os.path.join(settings.MEDIA_ROOT, 'processed_files', file_path)
    
    # Find all Excel files in the directory
    try:
        excel_files = [f for f in os.listdir(media_dir) if f.endswith('.xlsx')]
    except FileNotFoundError:
        return JsonResponse({'error': 'Directory not found'}, status=500)
    
    # Match requested categories with available files
    matched_files = []
    missing_categories = []
    
    for category in categories:
        matched = False
        for file in excel_files:
            file_name_without_ext = os.path.splitext(file)[0]
            if category.lower() in file_name_without_ext.lower():
                matched_files.append((category, file))
                matched = True
                break
        
        if not matched:
            missing_categories.append(category)
    
    if not matched_files:
        return JsonResponse({
            'error': 'No files found for the requested categories',
            'missing_categories': missing_categories
        }, status=404)
    
    # If there are missing categories, include that in the response but continue with the ones found
    message = None
    if missing_categories:
        message = f"Categories not found: {', '.join(missing_categories)}"
    
    # If only one category is requested and found, return a single Excel file directly
    if len(matched_files) == 1 and len(categories) == 1:
        category, file_name = matched_files[0]
        file_full_path = os.path.join(media_dir, file_name)
        
        try:
            # Read file directly without pandas
            with open(file_full_path, 'rb') as excel_file:
                file_content = excel_file.read()
            
            # Create response with the raw Excel file content
            response = HttpResponse(
                file_content, 
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = f'attachment; filename="{category}.xlsx"'
            
            return response
        
        except Exception as e:
            return JsonResponse({'error': f'Error reading the file: {str(e)}'}, status=500)
    
    # If multiple categories are requested or found, create a zip file
    else:
        # Create a BytesIO object to store the zip file
        zip_buffer = io.BytesIO()
        
        # Create a zip file
        with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            for category, file_name in matched_files:
                file_full_path = os.path.join(media_dir, file_name)
                
                try:
                    # Read the Excel file directly as binary
                    with open(file_full_path, 'rb') as excel_file:
                        file_content = excel_file.read()
                    
                    # Add the Excel file directly to the zip file
                    zip_file.writestr(f"{category}.xlsx", file_content)
                
                except Exception as e:
                    # If there's an error with one file, continue with the others
                    continue
        
        # Prepare the response with the zip file
        zip_buffer.seek(0)
        response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename="categories.zip"'
        
        # If there's a message about missing categories, include it in a header
        if message:
            response['X-Missing-Categories'] = message
        
        return response