from rest_framework import serializers
from .models import Expense
from .category_choices import CATEGORY_CHOICES


class ExpenseSerializer(serializers.ModelSerializer):
    category = serializers.ChoiceField(choices=CATEGORY_CHOICES)
    class Meta :
        model = Expense
        fields = ['id', 'user', 'title', 'amount', 'date', 'category', 'note', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


    