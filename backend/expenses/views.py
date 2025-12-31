from django.shortcuts import render
from .models import Expense
from .serializers import ExpenseSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response


class ExpenseListCreate(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    # Only return expenses of the logged-in user
    def get_queryset(self):
        user = self.request.user
        return Expense.objects.filter(user=user).order_by('-date')

    # Automatically assign logged-in user on create
    def perform_create(self, serializer):
        # Save the expense with the logged-in user
        expense = serializer.save(user=self.request.user)

        # Initialize budget if it's None
        user = self.request.user
        if user.budget is None:
            user.budget = expense.amount * 10  # example: set budget 10x first expense
            user.save()




class ExpensesDelete(generics.DestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]


    # Only return expenses of the logged-in user
    def get_queryset(self):
        user = self.request.user
        return Expense.objects.filter(user=user).order_by('-date')



# for the dashboard !
class UserInfo(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "fullname": user.fullname,
            "email": user.email,
            "username": user.username,
            "budget" : user.budget,

        })
    

# for patch 
class ExpenseDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    # Only allow the logged-in user to access their own expenses
    def get_queryset(self):
        user = self.request.user
        return Expense.objects.filter(user=user)

