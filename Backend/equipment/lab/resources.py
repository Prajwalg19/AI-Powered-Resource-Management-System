# from import_export  import resources
from .models  import Department, Apparatus, Consumable, ConsumableStock, Equipment, Experiment, Invoice, PurchaseOrder, EquipmentIssue , EquipmentReview

# Import the required modules



# Define the resource for the PurchaseOrder model
class PurchaseOrderResource(resources.ModelResource):
    class Meta:
        model = PurchaseOrder

# Define the resource for the Invoice model
class InvoiceResource(resources.ModelResource):
    class Meta:
        model = Invoice

# Define the resource for the Equipment model
class EquipmentResource(resources.ModelResource):
    class Meta:
        model = Equipment

# Define the resource for the Consumable model
class ConsumableResource(resources.ModelResource):
    class Meta:
        model = Consumable

# Define the resource for the ConsumableStock model
class ConsumableStockResource(resources.ModelResource):
    class Meta:
        model = ConsumableStock

# Define the resource for the Experiment model
class ExperimentResource(resources.ModelResource):
    class Meta:
        model = Experiment
 
# Define the resource for the Apparatus model
class ApparatusResource(resources.ModelResource):
    class Meta:
        model = Apparatus

class EquipmentIssueResource(resources.ModelResource):
    class Meta:
        model = EquipmentIssue

class EquipmentReviewResource(resources.ModelResource):
    class Meta:
        model = EquipmentReview
