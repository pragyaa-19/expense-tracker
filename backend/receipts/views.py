from rest_framework.generics import CreateAPIView
from rest_framework import permissions, status
from rest_framework.response import Response
from .serializers import ReceiptFileSerializer
from .utils.ocr_reader import extract_text_from_file, extract_items
from django.conf import settings
import os

class ReceiptUploadView(CreateAPIView):
    serializer_class = ReceiptFileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ReceiptFileSerializer(data={
            "file": file_obj,
            "original_filename": file_obj.name
        })
        serializer.is_valid(raise_exception=True)
        receipt = serializer.save(uploaded_by=request.user)

        file_path = os.path.join(settings.MEDIA_ROOT, receipt.file.name)

        # Extract all items from the receipt
        text = extract_text_from_file(file_path)
        items = extract_items(text)  # list of dicts: title, amount, date, vendor

        return Response({
            "id": receipt.id,
            "file_url": request.build_absolute_uri(receipt.file.url),
            "original_filename": receipt.original_filename,
            "items": items  # send all extracted items to frontend
        }, status=status.HTTP_201_CREATED)

