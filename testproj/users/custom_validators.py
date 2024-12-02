import re
from django.core.exceptions import ValidationError

def validate_phone_number(value):
    # Регулярное выражение для проверки номера телефона
    phone_pattern = r'^\+?\d{10,15}$'
    if not re.match(phone_pattern, value):
        raise ValidationError("Phone number must start with '+' and contain 10-15 digits.")
