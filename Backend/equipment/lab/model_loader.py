import cv2
import pickle
from tensorflow.keras.models import load_model

class ModelLoader:
    def __init__(self):
        self.net = None
        self.le = None
        self.model = None

    def load_models(self):
        try:
            proto_path = "local_models/face_detector/deploy.prototxt"
            model_path = "local_models/face_detector/res10_300x300_ssd_iter_140000.caffemodel"
            self.net = cv2.dnn.readNetFromCaffe(proto_path, model_path)

            with open("local_models/face_detector/le.pickle", "rb") as le_file:
                self.le = pickle.load(le_file)

            self.model = load_model("local_models/liveness.model.h5")
            self.model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        except Exception as e:
            print(f"Error loading models: {e}")
            raise e


import os
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from vosk import Model, KaldiRecognizer, SetLogLevel
class loadLLM:
    def __init__(self):
        self.tokenizer = None
        self.model = None

    def load_models(self):
        try:
            model_name = "google/flan-t5-large"
            local_model_directory = "/flan-t5-large/"

            if not os.path.exists(local_model_directory):
                self.tokenizer = AutoTokenizer.from_pretrained(model_name)
                self.model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

                self.tokenizer.save_pretrained(local_model_directory)
                self.model.save_pretrained(local_model_directory)
            else:
                self.tokenizer = AutoTokenizer.from_pretrained(local_model_directory)
                self.model = AutoModelForSeq2SeqLM.from_pretrained(local_model_directory)
        except Exception as e:
            print(f"Error loading models: {e}")
            raise e



class voskModel:
    def __init__ (self):
        self.rec= None
    
    def loadVoskModel (self):
        try:
            SAMPLE_RATE = 16000

            SetLogLevel(0)

            path = "local_models/indian"
            model = Model(path)
            self.rec = KaldiRecognizer(model, SAMPLE_RATE)
        except Exception as e :
            print(e)


model_loader = ModelLoader()
llm_Loader = loadLLM()
vosk_loader = voskModel()

