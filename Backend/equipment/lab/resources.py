from import_export  import resources
from .models  import Person, Department


class PersonResource(resources.ModelResource) :
    class meta :
        model = Person

class DepResource(resources.ModelResource) :
    class meta :
        model = Department

