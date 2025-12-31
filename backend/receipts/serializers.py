from rest_framework import serializers
from .models import ReceiptFile

class ReceiptFileSerializer(serializers.ModelSerializer):
    extracted_amount = serializers.FloatField(read_only=True)
    extracted_date = serializers.CharField(read_only=True)
    extracted_vendor = serializers.CharField(read_only=True)

    class Meta:
        model = ReceiptFile
        fields = ["id", "file", "original_filename", "extracted_amount", "extracted_date", "extracted_vendor"]
