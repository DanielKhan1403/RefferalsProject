from django.contrib import admin
from django.urls import path
from django.urls.conf import include
from django.shortcuts import redirect

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Создание схемы документации
schema_view = get_schema_view(
   openapi.Info(
      title="Your API",
      default_version='v1',
      description="API documentation",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@example.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


def redirect_to_swagger(request):
    return redirect('/swagger/')

urlpatterns = [
   path('admin/', admin.site.urls),
   path('api/v1/auth/', include('users.urls')),
   path('', redirect_to_swagger),
   path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
   path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
