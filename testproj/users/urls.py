
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView

from . import views

urlpatterns = [
    path('register/', views.UserRegisterView.as_view(), name='user-register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('profile/', views.UserProfileView.as_view(), name='user-profile'),
    path('activate/', views.ActivateInviteCode.as_view(), name='activate-invite-code'),
]
