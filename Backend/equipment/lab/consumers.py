import cv2
import pickle
import numpy as np
import json
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from channels.generic.websocket import AsyncWebsocketConsumer
import asyncio
from .model_loader import model_loader

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if model_loader.net is None or model_loader.le is None or model_loader.model is None:
            await self.close(code=1011)
            return

        self.net = model_loader.net
        self.le = model_loader.le
        self.model = model_loader.model

        self.count = 0
        self.real = 0
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
            real_faces = []

            for i in range(detections.shape[2]):
                confidence = detections[0, 0, i, 2]
                if confidence > 0.5:
                    box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                    (startX, startY, endX, endY) = box.astype("int")
                    startX, startY = max(0, startX), max(0, startY)
                    endX, endY = min(w, endX), min(h, endY)
                    face = frame[startY:endY, startX:endX]
                    face = cv2.resize(face, (32, 32)).astype("float") / 255.0
                    face = img_to_array(face)
                    face = np.expand_dims(face, axis=0)
                    real_faces.append(face)

            if real_faces:
                real_faces = np.vstack(real_faces)
                preds = self.model.predict(real_faces)
                for pred in preds:
                    label = self.le.classes_[np.argmax(pred)]
                    self.count += 1
                    if label == "real":
                        self.real += 1
                    if self.count == 50:
                        response_data = {"message": "done", "count": self.real}
                        await self.send(text_data=json.dumps(response_data))
                        await self.close(code=1000)
                        return
        except Exception as e:
            print(f"Error processing frame: {e}")
            await self.close(code=1011)



# import cv2
# import numpy as np
# import json
# from tensorflow.keras.preprocessing.image import img_to_array
# from channels.generic.websocket import AsyncWebsocketConsumer
# from .model_loader import model_loader
# import asyncio
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
#
#         # Create a queue to handle incoming frames
#         self.frame_queue = asyncio.Queue(maxsize=10)
#         self.processing_task = asyncio.create_task(self.process_frames())
#
#         await self.accept()
#
#     async def disconnect(self, close_code):
#         self.processing_task.cancel()
#         await self.processing_task
#
#     async def receive(self, text_data=None, bytes_data=None):
#         if bytes_data:
#             try:
#                 await self.frame_queue.put(bytes_data)
#             except asyncio.QueueFull:
#                 # Handle the case where the queue is full (backpressure)
#                 print("Frame queue is full, dropping frame")
#
#     async def process_frames(self):
#         try:
#             while True:
#                 frame_data = await self.frame_queue.get()
#                 await self.process_frame(frame_data)
#         except asyncio.CancelledError:
#             pass  # Handle the cancellation of the processing task
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
#                     real_faces.append(face)
#
#             if real_faces:
#                 real_faces = np.vstack(real_faces)
#                 preds = self.model.predict(real_faces)
#                 for pred in preds:
#                     label = self.le.classes_[np.argmax(pred)]
#                     self.count += 1
#                     if label == "real":
#                         self.real += 1
#                     if self.count == 50:
#                         response_data = {"message": "done", "count": self.real}
#                         await self.send(text_data=json.dumps(response_data))
#                         await self.close(code=1000)
#                         return
#         except Exception as e:
#             print(f"Error processing frame: {e}")
#             await self.close(code=1011)
