from django.test import TestCase

# Create your tests here.
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from users.models import User

class UserRegistrationTest(APITestCase):

    def setUp(self):
        """Создаем данные, которые будут использоваться в тестах"""
        self.url = reverse('user-register')  # URL для регистрации пользователя

    def test_register_user(self):
        """Тестируем регистрацию нового пользователя"""
        data = {
            'username': 'testuser',
            'phone_number': '1234567890',
            'password': 'testpassword123',
        }
        response = self.client.post(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  # Проверяем, что статус код - 201 (успешное создание)
        self.assertEqual(User.objects.count(), 1)  # Проверяем, что пользователь был создан в базе данных
        self.assertEqual(User.objects.get().username, 'testuser')  # Проверяем, что имя пользователя совпадает


class ActivateInviteCodeTest(APITestCase):
    def setUp(self):
        # Создаем двух пользователей с уникальными номерами телефонов
        self.user1 = User.objects.create_user(
            username='testuser1',
            password='password',
            invite_code='valid_code',
            phone_number='1234567890'  # Уникальный номер телефона
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='password',
            invite_code=None,  # У второго пользователя нет инвайт-кода
            phone_number='0987654321'  # Уникальный номер телефона
        )
        # URL для логина и активации инвайт-кода
        self.login_url = reverse('login')
        self.activate_url = reverse('activate-invite-code')

    def test_activate_invite_code(self):
        # Логиним второго пользователя
        login_data = {
            'username': 'testuser2',
            'password': 'password'
        }

        response = self.client.post(self.login_url, login_data, format='json')
        token = response.data['access']  # Получаем токен

        # Устанавливаем токен в заголовок
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

        # Данные для запроса активации инвайт-кода
        data = {'invite_code': 'valid_code'}  # Используем код первого пользователя

        # Отправка POST-запроса
        response = self.client.post(self.activate_url, data, format='json')

        # Проверка успешности активации
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)
        self.assertEqual(response.data['message'], 'Код успешно активирован')



class UserProfileTest(APITestCase):

    def setUp(self):
        """Создаем данные для тестирования профиля"""
        self.user = User.objects.create_user(username='testuser', phone_number='1234567890', password='testpassword123')
        self.url = reverse('user-profile')  # URL для получения профиля пользователя

    def test_get_user_profile(self):
        """Тестируем получение профиля пользователя"""
        self.client.force_authenticate(user=self.user)  # Аутентификация пользователя

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Проверяем, что ответ успешный
        self.assertEqual(response.data['username'], 'testuser')  # Проверяем, что имя пользователя верное
        self.assertEqual(response.data['phone_number'], '1234567890')  # Проверяем, что номер телефона верный
