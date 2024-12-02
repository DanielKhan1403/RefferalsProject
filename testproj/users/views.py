from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from users.serializers import UserSerializer, ActivatedInviteCodeSerializer, UserProfileSerializer


# Create your views here.


class UserRegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ActivateInviteCode(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ActivatedInviteCodeSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Код успешно активирован", **serializer.data},
                status=status.HTTP_200_OK
            )
        print(serializer.errors)

        return Response(
            {
                "message": "Возникли ошибки при обработке кода, пожалуйста, напишите в поддержку - marakeshm1403@gmail.com либо проверьте правильность кода",
                **serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
