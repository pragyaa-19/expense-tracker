from django.db import models
from django.conf import settings
from . category_choices import CATEGORY_CHOICES

class Expense(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) # LINKING  EXPENSE WITH USER is the foreign key that keeps expenses separated by user.
    title = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    category = models.CharField(max_length=50,choices=CATEGORY_CHOICES)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.title} - {self.amount}"