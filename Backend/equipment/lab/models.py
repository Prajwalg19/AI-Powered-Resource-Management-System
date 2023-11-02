from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

# Department
class Department(models.Model):
    department_number = models.CharField(max_length=10, primary_key=True, unique=True)
    department_name = models.CharField(max_length=20 , unique=True)
    hod_name = models.CharField(max_length=20)

    def __str__(self):
        return f" {self.department_name}"

# Lab
class Lab(models.Model):
    lab_number = models.CharField(max_length=10, unique=True, primary_key=True)
    lab_name = models.CharField(max_length=20)
    lab_incharge = models.CharField(max_length=20)
    department_name = models.ForeignKey(Department, on_delete=models.CASCADE)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.lab_name}"  # Use department_name





    
class PurchaseOrder(models.Model):
    purchase_order_number = models.CharField(max_length=10, unique=True, primary_key=True)
    purchase_order_date = models.DateField()
    originator = models.ForeignKey(Department, on_delete=models.CASCADE)
    supplier = models.CharField(max_length=20)
    total_value = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.purchase_order_number}, {self.purchase_order_date}"

# Invoice
class Invoice(models.Model):
    purchase_order_no = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)
    purchase_date = models.DateField()
    item_cost = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    item_name = models.CharField(max_length=100)
    invoice_number = models.CharField(max_length=20, unique=True, primary_key=True)

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.item_name}"
    

# Equipment
class Equipment(models.Model):
    equipment_serial_number = models.CharField(max_length=50, unique=True, primary_key=True)
    lab_number = models.ForeignKey(Lab, on_delete=models.CASCADE)
    description = models.TextField()
    invoice_number = models.ForeignKey(Invoice, on_delete=models.CASCADE)  # Use 'Invoice' as a string
    life = models.PositiveBigIntegerField()
    residual_value = models.IntegerField(default=0)  # Provide a default value

    def __str__(self):
        return f"{self.equipment_serial_number}, {'Working' if self.life else 'Not Working'}"



class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, password2=None, role=None):
        """
        Creates and saves a User with the given email, name, tc and password.
        """
        if not email:
            raise ValueError('User must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            name=name,
            role=role
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, role=None):
        """
        Creates and saves a superuser with the given email, name, tc and password.
        """
        user = self.create_user(
            email,
            password=password,
            name=name,
            role=role,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

# Custom User Model
class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='Email',
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'role']

    def str(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


# Consumables
class Consumable(models.Model):
    part_number = models.CharField(max_length=50, primary_key=True, unique=True)
    invoice_number = models.ForeignKey(Invoice,on_delete=models.CASCADE)
    lab_number = models.ForeignKey(Lab,on_delete=models.CASCADE)
    distributed_quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"Consumable {self.part_number} - Invoice {self.invoice_number}"

# Consumable stock
class ConsumableStock(models.Model):
    part_number = models.ForeignKey(Consumable,on_delete=models.CASCADE)
    stock_quantity = models.PositiveIntegerField()
    lead = models.PositiveIntegerField()
    lag = models.PositiveIntegerField()

    def __str__(self):
        return f"Consumable Stock for {self.part_number}"

class Experiment(models.Model):
    experiment_number =  models.CharField(max_length=255)
    experiment_name =  models.CharField(max_length=30, unique=True, primary_key=True)
    
    def __str__(self):
        return f"{self.experiment_number}, {self.experiment_name}"

class Apparatus(models.Model):
    experiment_name = models.ForeignKey(Experiment, on_delete=models.CASCADE) 
    apparatus_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.apparatus_name} for {self.experiment_name.experiment_name}"

    

class EquipmentIssue(models.Model):
    experiment_name = models.ForeignKey(Experiment, on_delete=models.CASCADE)
    lab_incharge = models.ForeignKey(Lab, on_delete=models.CASCADE, default=1)
    number_of_equipments = models.PositiveIntegerField()
    details = models.TextField()

    def __str__(self):
        return f"{self.experiment_name}, {self.lab_incharge}"
    
#Equipment Review
class EquipmentReview(models.Model):
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    date = models.DateField()
    lab_incharge = models.ForeignKey(Lab, on_delete=models.CASCADE)  # Use 'LabInCharge' as a string
    not_working_quantity = models.PositiveIntegerField()
    remarks = models.TextField()

    def __str__(self):
        return f"Review for {self.equipment.equipment_serial_number} on {self.date}"

class Person(models.Model):
    name = models.CharField(max_length=100)
    marks = models.CharField(max_length=100)

