from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework import viewsets, permissions
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth import get_user_model

from .serializers import CustomUserSerializer, CustomTokenObtainPairSerializer
from .models import Role
from .permissions import IsRoleAdmin




User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        if not data.get("role"):
            return Response({"error": "Role is required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=data["username"]).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=data["email"]).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        role, created = Role.objects.get_or_create(name=data["role"])
        user = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            role=role
        )
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CustomUserSerializer
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsRoleAdmin()]
        else:
            return [permissions.IsAuthenticated()]


    def get_queryset(self):
        # You can customize this to limit what users can see
        return super().get_queryset()