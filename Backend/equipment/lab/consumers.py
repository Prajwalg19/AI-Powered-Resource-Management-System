import cv2
import numpy as np
import pickle
from channels.generic.websocket import AsyncWebsocketConsumer
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.models import load_model
import json

class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Load face detection model and label encoder
        protoPath = "local_models/face_detector/deploy.prototxt"
        modelPath = "local_models/face_detector/res10_300x300_ssd_iter_140000.caffemodel"
        self.net = cv2.dnn.readNetFromCaffe(protoPath, modelPath)
        self.le = pickle.loads(open("local_models/face_detector/le.pickle", "rb").read())
        # Load liveness detection model
        self.model = load_model("local_models/liveness.model.h5")
        self.model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
        self.count = 0
        self.real = 0

    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        if bytes_data is not None:
            # Process received binary data
            await self.process_frame(bytes_data)

    async def process_frame(self, frame_data):
        # Convert received image data to numpy array
        nparr = np.frombuffer(frame_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        (h, w) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
        # pass the blob through the network and obtain the detections and predictions
        self.net.setInput(blob)
        detections = self.net.forward()

        real_faces = []
        for i in range(0, detections.shape[2]):
            # extract the confidence (i.e., probability) associated with the prediction
            confidence = detections[0, 0, i, 2]
            if confidence > 0.5 :
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                # ensure the detected bounding box does not fall outside the dimensions of the frame
                startX = max(0, startX)
                startY = max(0, startY)
                endX = min(w, endX)
                endY = min(h, endY)
                # extract the face ROI and preprocess it
                face = frame[startY:endY, startX:endX]
                face = cv2.resize(face, (32, 32))
                face = face.astype("float") / 255.0
                face = img_to_array(face)
                face = np.expand_dims(face, axis=0)
                real_faces.append(face)

        if real_faces:
            # Batch process the detected faces
            real_faces = np.vstack(real_faces)
            preds = self.model.predict(real_faces)
            for pred in preds:
                j = np.argmax(pred)
                label = self.le.classes_[j]
                self.count += 1
                if label == "real":
                    self.real += 1
                if self.count == 50:
                    response_data = {"message": "done", "count": self.real}
                    response_json = json.dumps(response_data)
                    await self.send(text_data=response_json)
                    await self.close(code=1000)
                    return
