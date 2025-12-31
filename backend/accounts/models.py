from django.db import models
from django.contrib.auth.models import AbstractUser


class MyUser(AbstractUser):
    fullname = models.CharField(max_length=50)
    profile = models.ImageField(upload_to='profiles/', blank=True, null=True)
    email = models.EmailField(max_length=50,unique=True)
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True,blank=True)  


    def __str__(self):
        return self.fullname
    
   