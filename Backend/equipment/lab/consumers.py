# import cv2
# import pickle
# import numpy as np
# import json
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing.image import img_to_array
# from channels.generic.websocket import AsyncWebsocketConsumer
# import asyncio
# from .model_loader import model_loader

import os
import cv2
import pickle
import numpy as np
import json
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from .model_loader import model_loader
import face_recognition

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if model_loader.net is None or model_loader.le is None or model_loader.model is None:
            await self.close(code=1011)
            return

        self.net = model_loader.net
        self.le = model_loader.le
        self.model = model_loader.model
        self.encoded_data = model_loader.encoded_data

        self.count = 0
        self.real = 0
        self.sequence_count = 0
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        if bytes_data:
            await self.process_frame(bytes_data)

    async def process_frame(self, frame_data):
        try:
            nparr = np.frombuffer(frame_data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            (h, w) = frame.shape[:2]
            blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
            self.net.setInput(blob)
            detections = self.net.forward()
            self.count +=1
            if(self.count >100):
               response_data = {"message": "unrecognized"}
               await self.send(text_data=json.dumps(response_data))
               await self.close(code=1000)
               return

            for i in range(detections.shape[2]):
                confidence = detections[0, 0, i, 2]
                if confidence > 0.7:  # Adjust confidence threshold if needed
                    self.sequence_count +=1
                    box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                    (startX, startY, endX, endY) = box.astype("int")
                    startX, startY = max(0, startX-20), max(0, startY-20)
                    endX, endY = min(w, endX+20), min(h, endY+20)
                    face = frame[startY:endY, startX:endX]
                    
                    face_liveness = cv2.resize(face, (32, 32)).astype("float") / 255.0
                    face_liveness = img_to_array(face_liveness)
                    face_liveness = np.expand_dims(face_liveness, axis=0)

                    preds = self.model.predict(face_liveness)[0]
                    label = self.le.classes_[np.argmax(preds)]

                    rgb = cv2.cvtColor(face, cv2.COLOR_BGR2RGB)
                    encodings = face_recognition.face_encodings(rgb)
                    name = "Unknown"

                    for encoding in encodings:
                        matches = face_recognition.compare_faces(self.encoded_data['encodings'], encoding)
                        if True in matches:
                            matchedIdxs = [i for i, b in enumerate(matches) if b]
                            counts = {}
                            for i in matchedIdxs:
                                name = self.encoded_data['names'][i]
                                counts[name] = counts.get(name, 0) + 1
                            name = max(counts, key=counts.get)

                    if name == "Unknown" or label == "fake":
                        continue;
                    else:
                        self.real += 1

                    print(f'[INFO] {name}, {label}, seq: {self.real}')

                    if self.sequence_count == 50:
                        if self.real>=25:
                            response_data = {"message": "recognized", "name": name, "label": label}
                            await self.send(text_data=json.dumps(response_data))
                            await self.close(code=1000)
                            return
                        else :
                            response_data = {"message": "unrecognized"}
                            await self.send(text_data=json.dumps(response_data))
                            await self.close(code=1000)
                            return

        except Exception as e:
            print(f"Error processing frame: {e}")
            await self.close(code=1011)

#
# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         if model_loader.net is None or model_loader.le is None or model_loader.model is None:
#             await self.close(code=1011)
#             return
#
#         self.net = model_loader.net
#         self.le = model_loader.le
#         self.model = model_loader.model
#
#         self.count = 0
#         self.real = 0
#         await self.accept()
#
#     async def receive(self, text_data=None, bytes_data=None):
#         if bytes_data:
#             await self.process_frame(bytes_data)
#
#     async def process_frame(self, frame_data):
#         try:
#             nparr = np.frombuffer(frame_data, np.uint8)
#             frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#             (h, w) = frame.shape[:2]
#             blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
#             self.net.setInput(blob)
#             detections = self.net.forward()
#             real_faces = []
#
#             for i in range(detections.shape[2]):
#                 confidence = detections[0, 0, i, 2]
#                 if confidence > 0.5:
#                     box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
#                     (startX, startY, endX, endY) = box.astype("int")
#                     startX, startY = max(0, startX), max(0, startY)
#                     endX, endY = min(w, endX), min(h, endY)
#                     face = frame[startY:endY, startX:endX]
#                     face = cv2.resize(face, (32, 32)).astype("float") / 255.0
#                     face = img_to_array(face)
#                     face = np.expand_dims(face, axis=0)
#                     # real_faces.append(face)
#
#             # if real_faces:
#                     # real_faces = np.vstack(real_faces)
#                     preds = self.model.predict(face)[0]
#                     label = self.le.classes_[np.argmax(preds)]
#                     self.count += 1
#                     if label == "real":
#                             self.real += 1
#                     if self.count == 50:
#                             response_data = {"message": "done", "count": self.real}
#                             await self.send(text_data=json.dumps(response_data))
#                             await self.close(code=1000)
#                             return
#         except Exception as e:
#             print(f"Error processing frame: {e}")
#             await self.close(code=1011)
#
