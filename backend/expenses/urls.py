from django.urls import path
from . import views

urlpatterns = [
    path("",views.ExpenseListCreate.as_view(), name="list-create-expenses" ),
    path('<int:pk>/', views.ExpenseDetail.as_view(), name='expense-detail'),
    path("delete/<int:pk>/",views.ExpensesDelete.as_view(), name="delete-expenses" ),
    path('user-info/', views.UserInfo.as_view()),

]