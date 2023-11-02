from .models import Person, Department
class PersonForm(forms.Form):
    class meta:
        model  = Person
        fields ='__all__'

class DepForm(forms.Form):
    class meta:
        model  = Department
        fields ='__all__'
