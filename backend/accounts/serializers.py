from rest_framework import serializers
from .models import MyUser
from django.contrib.auth.password_validation import validate_password


class NewUserSerializer(serializers.ModelSerializer):
    # Ensure password is write-only and validated
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = MyUser
        fields = ['id', 'username', 'email', 'fullname', 'password', 'profile',"budget"]
        extra_kwargs = {
            'profile': {'required': False, 'allow_null': True}
        }

    def create(self, validated_data):
        # Use create_user to hash the password correctly
        user = MyUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            fullname=validated_data['fullname'],
            password=validated_data['password'],
            profile=validated_data.get('profile')  
        )
        return user
    

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

