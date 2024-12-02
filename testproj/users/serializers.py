from rest_framework import serializers
from users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'phone_number', 'invite_code', 'activated_invite_code']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.generate_invite_code()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    users_who_used_invite_code = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'phone_number',
            'invite_code',
            'activated_invite_code',
            'reffered_by',
            'users_who_used_invite_code',
        ]

    def get_users_who_used_invite_code(self, obj):
        # Получаем всех пользователей, которые использовали данный invite_code
        users = User.objects.filter(activated_invite_code=obj.invite_code)
        return [{"id": user.id, "username": user.username, "phone_number": user.phone_number} for user in users]


class ActivatedInviteCodeSerializer(serializers.ModelSerializer):
    invite_code = serializers.CharField(required=True)

    def validate_invite_code(self, value):
        # Проверяем, существует ли такой invite_code
        if not User.objects.filter(invite_code=value).exists():
            raise serializers.ValidationError("Такого кода не существует")
        return value

    def validate(self, data):
        user = self.context['request'].user
        code = data.get('invite_code')


        if user.activated_invite_code:
            raise serializers.ValidationError('Код уже активирован')

        if user.invite_code == code:
            raise serializers.ValidationError(
                'Вы не можете активировать свой собственный код. Отправьте его другу, который ещё не зарегистрирован')

        return data

    def create(self, validated_data):
        user = self.context['request'].user
        invite_code = validated_data.get('invite_code')


        inviter = User.objects.get(invite_code=invite_code)


        user.activated_invite_code = inviter.invite_code  # Сохраняем именно код
        user.reffered_by = inviter  # Сохраняем самого пользователя
        user.save()

        return user

    class Meta:
        model = User
        fields = ['invite_code']
