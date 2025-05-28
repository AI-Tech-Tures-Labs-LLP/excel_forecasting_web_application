from django.urls import path,include
from .views import UploadXlsxAPIView,DownloadFileAPIView

from rest_framework.routers import DefaultRouter
from .views import ProductDetailViewSet, StoreForecastViewSet, ComForecastViewSet, OmniForecastViewSet, ForecastViewSet, ForecastNoteViewSet, DownloadForecastSummaryExcel

router = DefaultRouter()
router.register(r'api/product', ProductDetailViewSet, basename='product-detail-forecast')
router.register(r'store-forecast', StoreForecastViewSet, basename='store-forecast')
router.register(r'com-forecast', ComForecastViewSet, basename='com-forecast')
router.register(r'omni-forecast', OmniForecastViewSet, basename='omni-forecast')
router.register(r'query', ForecastViewSet, basename='forecast')
router.register(r'forecast-notes', ForecastNoteViewSet, basename='forecastnote')


urlpatterns = [
    path('', include(router.urls)),
    path('upload/', UploadXlsxAPIView.as_view(), name='upload_xlsx'),
    path('api/download/', DownloadFileAPIView.as_view(), name='download_file'),
    path('export-summary/', DownloadForecastSummaryExcel.as_view(), name="export-summary"),

]
