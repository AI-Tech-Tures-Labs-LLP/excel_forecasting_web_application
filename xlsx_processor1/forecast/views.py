import os
import time
import json 
import io
import zipfile 
import pandas as pd
from datetime import datetime

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


from .models import ProductDetail, MonthlyForecast, StoreForecast, ComForecast, OmniForecast, ForecastNote, SheetUpload
from .serializers import ProductDetailSerializer, MonthlyForecastSerializer, StoreForecastSerializer, ComForecastSerializer, OmniForecastSerializer, ForecastNoteSerializer, SheetUploadSerializer
from .service.exportExcel import process_data
from forecast.service.rollingfc import recalculate_all
from forecast.service.adddatabase import save_forecast_data
from forecast.service.utils import get_c2_value

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
 
def get_product_forecast_data(pid,sheet_object):
        product = get_object_or_404(ProductDetail, product_id=pid,sheet=sheet_object)
        return product.category, product.rolling_method, product.std_trend_original, product.std_index_value_original, product.month_12_fc_index_original, product.forecasting_method_original,  product.algorithm_generated_final_quantity

def get_planned_data(pid, year,sheet_object):
    product = ProductDetail.objects.filter(product_id=pid,sheet=sheet_object).first()
    if not product:
        return {"error": "Product not found"}

    result = {
        "planned_shipments": {},
        "planned_fc": {}
    }

    for variable in ["planned_shipments", "planned_fc"]:
        forecast = MonthlyForecast.objects.filter(
            productdetail=product,
            variable_name=variable,
            year=year
        ).first()

        if forecast:
            result[variable] = {
                "JAN": forecast.jan,
                "FEB": forecast.feb,
                "MAR": forecast.mar,
                "APR": forecast.apr,
                "MAY": forecast.may,
                "JUN": forecast.jun,
                "JUL": forecast.jul,
                "AUG": forecast.aug,
                "SEP": forecast.sep,
                "OCT": forecast.oct,
                "NOV": forecast.nov,
                "DEC": forecast.dec,
            }

    return result

# Done
class UploadXlsxAPIView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get('file')
        output_folder = request.data.get('output_filename', '').strip()
        month_from = request.data.get('month_from')
        month_to = request.data.get('month_to')
        percentage = request.data.get('percentage')
        categories = request.data.get('categories')    
        print(f"Received file: {uploaded_file.name} with output folder: {output_folder}, month_from: {month_from}, month_to: {month_to}, percentage: {percentage}, categories: {categories}")   

        sheet = SheetUpload.objects.create(
            user=request.user,
            name=uploaded_file.name,
            file=uploaded_file,
            is_processed=False,
            output_folder=output_folder,
            month_from=month_from,
            month_to=month_to,
            percentage=percentage,
            categories=categories,
        )
        sheet.save()

        print(f"Sheet uploaded:",sheet)
        print(f"File uploaded: {uploaded_file.name} by user: {request.user.username}")
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
        current_date = datetime(2025,5,8)

        try:
            start_time = time.time()
            process_data(input_path, output_folder_path, month_from, month_to, percentage, input_tuple, sheet, current_date)
            elapsed_time = time.time() - start_time
            print(f"Processing took {elapsed_time:.3f}s")
            make_zip_and_delete(output_folder_path)
        except Exception as e:
            return Response({'error': f'Processing error: {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        zip_rel = f'processed_files/{output_folder}.zip'
        zip_url = request.build_absolute_uri(settings.MEDIA_URL + zip_rel)
        return Response({'file_url': zip_url}, status=status.HTTP_200_OK)

# Done
class ProductDetailViewSet(viewsets.ViewSet):
    lookup_field = "pk"         
    lookup_value_regex = r"[^/]+"
    def retrieve(self, request, pk=None):
        # Fetch product details
        sheet_id = request.query_params.get("sheet_id")
        if not sheet_id:
            return Response({"error": "sheet_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        product = get_object_or_404(ProductDetail, product_id=pk, sheet=sheet_id)
        product_serializer = ProductDetailSerializer(product)
        
        
        forecasts = MonthlyForecast.objects.filter(productdetail=product, sheet=sheet_id)
        forecast_serializer = MonthlyForecastSerializer(forecasts, many=True)
        
       
        store_forecasts = StoreForecast.objects.filter(pid=pk, sheet=sheet_id)
        store_serializer = StoreForecastSerializer(store_forecasts, many=True)

        com_forecasts = ComForecast.objects.filter(pid=pk, sheet=sheet_id)
        com_serializer = ComForecastSerializer(com_forecasts, many=True)

        omni_forecasts = OmniForecast.objects.filter(pid=pk, sheet=sheet_id)
        omni_serializer = OmniForecastSerializer(omni_forecasts, many=True)

        notes     = ForecastNote.objects.filter(productdetail=product, sheet=sheet_id)
        notes_serializer = ForecastNoteSerializer(notes, many=True)

        return Response({
            "product_details": product_serializer.data,
            "forecast_notes" : notes_serializer.data,
            "monthly_forecast": forecast_serializer.data,
            "store_forecast": store_serializer.data,
            "com_forecast": com_serializer.data,
            "omni_forecast": omni_serializer.data
        })
    

    def partial_update(self, request, pk=None):
        sheet_id = request.data.get("sheet_id")
        if not sheet_id:
            return Response({"error": "sheet_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Update ProductDetail (sheet-wise)
        product = get_object_or_404(ProductDetail, product_id=pk, sheet_id=sheet_id)
        product_serializer = ProductDetailSerializer(product, data=request.data.get("product_details", {}), partial=True)
        
        if product_serializer.is_valid():
            product_serializer.save()
        else:
            return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 2. Update/Create MonthlyForecast
        forecast_data = request.data.get("monthly_forecast", [])
        for forecast in forecast_data:
            forecast_instance = MonthlyForecast.objects.filter(
                productdetail=product,
                variable_name=forecast.get("variable_name"),
                year=forecast.get("year"),
                sheet_id=sheet_id
            ).first()

            if forecast_instance:
                forecast_serializer = MonthlyForecastSerializer(forecast_instance, data=forecast, partial=True)
            else:
                forecast["productdetail"] = product.id
                forecast["sheet"] = sheet_id
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
                note_instance = ForecastNote.objects.filter(id=note_id, sheet_id=sheet_id, productdetail=product).first()
                if note_instance:
                    note_serializer = ForecastNoteSerializer(note_instance, data=note, partial=True)
                else:
                    continue  # Skip invalid IDs
            else:
                note["productdetail"] = product.id
                note["sheet"] = sheet_id
                note_serializer = ForecastNoteSerializer(data=note)
            
            if note_serializer.is_valid():
                note_serializer.save()
            else:
                return Response(note_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # 4. Return updated data
        return Response({
            "product_details": product_serializer.data,
            "monthly_forecast": MonthlyForecastSerializer(
                MonthlyForecast.objects.filter(productdetail=product, sheet_id=sheet_id), many=True
            ).data,
            "forecast_notes": ForecastNoteSerializer(
                ForecastNote.objects.filter(productdetail=product, sheet_id=sheet_id), many=True
            ).data,
        })
    
    

    @action(detail=False, methods=["post"])
    def recalculate_forecast(self, request):
        """
        POST /product/recalculate_forecast/

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
        sheet_id = request.data.get("sheet_id")
        sheet_object = get_object_or_404(SheetUpload, id=sheet_id)
        product_object = get_object_or_404(ProductDetail, product_id=pid, sheet=sheet_object)
        print("Changed Variable:", changed_variable)
        print("New Value:", new_value)
        print("Context Keys:", context_data.keys())
        print("PID:", pid)
        if not all([changed_variable, context_data, pid]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            updated_context = recalculate_all(changed_variable, new_value, context_data.copy(), product_object, sheet_object)
            print("Rolling 12 FC updated to Database ")
            return Response({"pid": pid,"updated_context": updated_context})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    @action(detail=False, methods=["post"])
    def save_recalculate(self,request):
        updated_context = request.data.get("updated_context")
        pid = request.data.get("pid")
        path = request.data.get("file_path")
        sheet_id = request.data.get("sheet_id")
        if not sheet_id:
            return Response({"error": "Missing sheet_id"}, status=status.HTTP_400_BAD_REQUEST)
        sheet_object = get_object_or_404(SheetUpload, id=sheet_id)
        save_forecast_data(pid, updated_context, sheet_object)
        category,rolling_method, std_trend , STD_index_value, month_12_fc_index, forecasting_method, total_added_qty = get_product_forecast_data(pid,sheet_object)
        result = get_planned_data(pid,2025,sheet_object)
        planned_shp = result["planned_shipments"]
        planned_fc = result["planned_fc"]
        get_c2_value(category,pid,std_trend,STD_index_value,month_12_fc_index,forecasting_method,planned_shp,planned_fc,path)

        print("Data saved to DB Successfully")
        return Response({"pid": pid, "updated_context": updated_context})


# Done 
class ForecastViewSet(ViewSet):
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=["get"])
    def filter_products(self, request):
        sheet_id = request.query_params.get("sheet_id")
        product_type = request.query_params.get("product_type")

        if not sheet_id:
            return Response({"error": "sheet_id is required"}, status=400)

        queryset = ProductDetail.objects.filter(sheet_id=sheet_id)

        if product_type:
            queryset = queryset.filter(product_type=product_type)

        multi_value_fields = ["category", "birthstone"]
        boolean_fields = [
            "is_red_box_item", "is_considered_birthstone",
            "is_added_quantity_using_macys_soq", "is_added_only_to_balance_macys_soq",
            "is_below_min_order", "is_over_macys_soq", "is_need_to_review_first",
            "valentine_day", "mothers_day", "fathers_day", "mens_day", "womens_day"
        ]

        for field in multi_value_fields:
            values = request.query_params.getlist(field)
            if values:
                queryset = queryset.filter(**{f"{field}__in": values})

        for field in boolean_fields:
            value = request.query_params.get(field)
            if value is not None and value.lower() in ["true", "false"]:
                queryset = queryset.filter(**{field: value.lower() == "true"})

        product_ids = [product.product_id for product in queryset]
        notes = ForecastNote.objects.filter(productdetail__product_id__in=product_ids)
        notes_map = {}
        serialized_notes = ForecastNoteSerializer(notes, many=True).data
        for note in serialized_notes:
            pid = note.get("productdetail")
            if pid not in notes_map:
                notes_map[pid] = []
            notes_map[pid].append(note)

        result = []
        for product in queryset:
            serialized_product = ProductDetailSerializer(product).data
            serialized_product["forecast_notes"] = notes_map.get(product.id, [])
            result.append(serialized_product)

        return Response(result)


# Done 
class DownloadForecastSummaryExcel(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        sheet_id = request.query_params.get("sheet_id")
        if not sheet_id:
            return Response({"detail": "sheet_id is required."}, status=400)

        sheet = get_object_or_404(SheetUpload, id=sheet_id)
        if not sheet.summary:
            return Response({"detail": "Summary file not found for this sheet."}, status=404)

        file_path = os.path.join(settings.MEDIA_ROOT, sheet.summary.name)
        if os.path.exists(file_path):
            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))
        return Response({"detail": "File not found."}, status=404)


# Done
class DownloadFinalQuantityReport(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        sheet_id = request.query_params.get("sheet_id")
        if not sheet_id:
            return Response({"detail": "sheet_id is required."}, status=400)

        try:
            sheet = SheetUpload.objects.get(id=sheet_id)
        except SheetUpload.DoesNotExist:
            return Response({"detail": "Sheet not found."}, status=404)

        products = ProductDetail.objects.filter(sheet_id=sheet_id)
        data = []

        for product in products:
            final_qty = (
                product.user_updated_final_quantity
                if product.user_updated_final_quantity is not None
                else product.algorithm_generated_final_quantity
            )
            if final_qty and final_qty > 0:
                data.append({
                    "PID": product.product_id,
                    "Category": product.category,
                    "Final_qty": final_qty,
                })

        if not data:
            return Response({"detail": "No data with final quantity > 0."}, status=204)

        df = pd.DataFrame(data)

        # Define and ensure file path
        file_name = f"FinalQuantityReport_Sheet_{sheet_id}.xlsx"
        file_path = os.path.join(settings.MEDIA_ROOT, 'final_quantity_report', file_name)
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        df.to_excel(file_path, index=False)

        # Save path to SheetUpload model
        sheet.final_quantity_report.name = os.path.join('final_quantity_report', file_name)
        sheet.save()

        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_name)

# Done
class ForecastNoteViewSet(viewsets.ModelViewSet):
    queryset = ForecastNote.objects.all().order_by('-updated_at')
    serializer_class = ForecastNoteSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        pid = self.request.query_params.get("pid")
        sheet_id = self.request.query_params.get("sheet_id")
        if not sheet_id:
            return Response({"detail": "sheet_id is required."}, status=400)
        
        if pid:
            queryset = queryset.filter(productdetail__product_id=pid)

        if sheet_id:
            queryset = queryset.filter(sheet_id=sheet_id)

        return queryset

# Done 
class FileCategoryDownloadAPIView(APIView):
    def get(self, request):
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
            return Response({'error': 'Category parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Split the categories by comma to handle multiple categories
        categories = [cat.strip() for cat in category_param.split(',')]
        
        # Define the media directory path
        media_dir = os.path.join(settings.MEDIA_ROOT, 'processed_files', file_path)
        
        # Find all Excel files in the directory
        try:
            excel_files = [f for f in os.listdir(media_dir) if f.endswith('.xlsx')]
        except FileNotFoundError:
            return Response({'error': 'Directory not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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
            return Response({
                'error': 'No files found for the requested categories',
                'missing_categories': missing_categories
            }, status=status.HTTP_404_NOT_FOUND)
        
        # If there are missing categories, include that in the response but continue with the ones found
        message = None
        if missing_categories:
            message = f"Categories not found: {', '.join(missing_categories)}"
        
        # If only one category is requested and found, return a single Excel file directly
        if len(matched_files) == 1 and len(categories) == 1:
            category, file_name = matched_files[0]
            file_full_path = os.path.join(media_dir, file_name)
            
            try:
                with open(file_full_path, 'rb') as excel_file:
                    file_content = excel_file.read()
                response = HttpResponse(
                    file_content, 
                    content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                )
                response['Content-Disposition'] = f'attachment; filename="{category}.xlsx"'
                return response
            except Exception as e:
                return Response({'error': f'Error reading the file: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # If multiple categories are requested or found, create a zip file
        else:
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for category, file_name in matched_files:
                    file_full_path = os.path.join(media_dir, file_name)
                    try:
                        with open(file_full_path, 'rb') as excel_file:
                            file_content = excel_file.read()
                        zip_file.writestr(f"{category}.xlsx", file_content)
                    except Exception as e:
                        continue
            zip_buffer.seek(0)
            response = HttpResponse(zip_buffer.getvalue(), content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="categories.zip"'
            if message:
                response['X-Missing-Categories'] = message
            return response
    
# Done
class SheetUploadViewSet(viewsets.ModelViewSet):
    queryset = SheetUpload.objects.all()
    serializer_class = SheetUploadSerializer
