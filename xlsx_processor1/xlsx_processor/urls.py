from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
import api
import forecast

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/v1/forecast/',include('forecast.urls')) , # Make sure this line is present
    path('api/v1/auth/', include('authentication.urls')),


] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
