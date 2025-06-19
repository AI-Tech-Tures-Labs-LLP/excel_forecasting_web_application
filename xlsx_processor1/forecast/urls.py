# from django.urls import path,include
# from .views import UploadXlsxAPIView

# from rest_framework.routers import DefaultRouter
# from .views import ProductDetailViewSet, ForecastViewSet, ForecastNoteViewSet, DownloadForecastSummaryExcel,FileCategoryDownloadAPIView, DownloadFinalQuantityReport, SheetUploadViewSet
# from .views import 


# router = DefaultRouter()
# router.register(r'product', ProductDetailViewSet, basename='product-detail-forecast')
# router.register(r'query', ForecastViewSet, basename='forecast')
# router.register(r'forecast-notes', ForecastNoteViewSet, basename='forecastnote')
# router.register(r'sheet-upload', SheetUploadViewSet, basename='sheet-upload')


# urlpatterns = [
#     path('', include(router.urls)),
#     path('upload/', UploadXlsxAPIView.as_view(), name='upload_xlsx'),
#     path('export-summary/', DownloadForecastSummaryExcel.as_view(), name="export-summary"),
#     path('download-category/', FileCategoryDownloadAPIView.as_view(), name='download_category_sheet'),
#     path('final-quantity-report/', DownloadFinalQuantityReport.as_view(), name="download-product-forecast"),    
# ]


# urls.py - Updated with NotificationViewSet

from django.urls import path, include
from .views import (
    UploadXlsxAPIView, 
    ProductDetailViewSet, 
    ForecastViewSet, 
    ForecastNoteViewSet, 
    DownloadForecastSummaryExcel,
    FileCategoryDownloadAPIView, 
    DownloadFinalQuantityReport, 
    SheetUploadViewSet,
    NotificationViewSet  # Add this import
)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'product', ProductDetailViewSet, basename='product-detail-forecast')
router.register(r'query', ForecastViewSet, basename='forecast')
router.register(r'forecast-notes', ForecastNoteViewSet, basename='forecastnote')
router.register(r'sheet-upload', SheetUploadViewSet, basename='sheet-upload')
router.register(r'notifications', NotificationViewSet, basename='notification')  # Add this line

urlpatterns = [
    path('', include(router.urls)),
    path('upload/', UploadXlsxAPIView.as_view(), name='upload_xlsx'),
    path('export-summary/', DownloadForecastSummaryExcel.as_view(), name="export-summary"),
    path('download-category/', FileCategoryDownloadAPIView.as_view(), name='download_category_sheet'),
    path('final-quantity-report/', DownloadFinalQuantityReport.as_view(), name="download-product-forecast"),    
]