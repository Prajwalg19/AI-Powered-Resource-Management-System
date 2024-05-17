from django.apps import AppConfig

class LabConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lab'

# __init__.py (in your Django app directory)

from .model_loader import model_loader, llm_Loader, vosk_loader 

def load_models_at_startup():
    try:
        model_loader.load_models()
        llm_Loader.load_models()
        vosk_loader.loadVoskModel()
        print("Models loaded successfully")
    except Exception as e:
        print(f"Failed to load models at startup: {e}")

load_models_at_startup()

