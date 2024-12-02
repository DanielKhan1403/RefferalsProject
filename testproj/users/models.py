
import random
import string
from django.contrib.auth.models import AbstractUser
from django.db import models
from .custom_validators  import validate_phone_number
# Create your models here.

class User(AbstractUser):
    phone_number = models.CharField(max_length=15,  unique=True, null=False, blank=False, validators=[validate_phone_number])
    invite_code = models.CharField(max_length=11, unique=True, null=True, blank=True)
    activated_invite_code = models.CharField(max_length=11, null=True, blank=True)
    reffered_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='refferals')

    def __str__(self):
        return f"{self.username} - {self.phone_number}"
    REQUIRED_FIELDS =  [
        'phone_number',
        'password'

    ]

    def generate_invite_code(self):
        self.invite_code = ''.join(random.choices(string.ascii_letters + string.digits, k=11))
        self.save()


