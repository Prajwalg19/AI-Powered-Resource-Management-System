from django.contrib import admin
from .models import Department, Lab, Equipment, EquipmentIssue, EquipmentReview, PurchaseOrder, Invoice, Consumable , ConsumableStock, Experiment, Apparatus
from lab.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserModelAdmin(BaseUserAdmin):
  # The fields to be used in displaying the User model.
  # These override the definitions on the base UserModelAdmin
  # that reference specific fields on auth.User.
  list_display = ('id', 'email', 'name', 'is_admin')
  list_filter = ('is_admin',)
  fieldsets = (
      ('User Credentials', {'fields': ('email', 'password')}),
      ('Personal info', {'fields': ('name',)}),
      ('Permissions', {'fields': ('is_admin',)}),
  )
  # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
  # overrides get_fieldsets to use this attribute when creating a user.
  add_fieldsets = (
      (None, {
          'classes': ('wide',),
          'fields': ('email', 'name', 'password1', 'password2'),
      }),
  )
  search_fields = ('email',)
  ordering = ('email', 'id')
  filter_horizontal = ()


# Now register the new UserModelAdmin...
admin.site.register(User, UserModelAdmin)
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('department_number', 'department_name', 'hod_name')

@admin.register(Lab)
class LabAdmin(admin.ModelAdmin):
    list_display = ('lab_number','lab_name','lab_incharge', 'department_name', 'location')

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('equipment_serial_number', 'lab_number','description','invoice_number','life', 'residual_value')

@admin.register(EquipmentIssue)
class EquipmentIssueAdmin(admin.ModelAdmin):
    list_display = ('experiment_name', 'lab_incharge', 'number_of_equipments','details')

@admin.register(EquipmentReview)
class EquipmentReviewAdmin(admin.ModelAdmin):
    list_display = ('equipment', 'quantity', 'date', 'lab_incharge','not_working_quantity','remarks')

@admin.register(PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ('purchase_order_number', 'purchase_order_date', 'originator', 'supplier', 'total_value')
    
@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'purchase_order_no', 'purchase_date', 'item_name', 'item_cost', 'quantity','item_name')


@admin.register(Consumable)
class ConsumableAdmin(admin.ModelAdmin):
    list_display = ('part_number', 'invoice_number', 'lab_number', 'distributed_quantity')

@admin.register(ConsumableStock)
class ConsumableStockAdmin(admin.ModelAdmin):
    list_display = ('part_number', 'stock_quantity', 'lead', 'lag')

@admin.register(Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    list_display = ('experiment_number', 'experiment_name')

@admin.register(Apparatus)
class ApparatusAdmin(admin.ModelAdmin):
    list_display = ('experiment_name', 'apparatus_name', 'quantity')
