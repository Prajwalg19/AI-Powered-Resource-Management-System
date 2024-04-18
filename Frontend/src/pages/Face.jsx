import { useRef, useEffect, useState } from "react";
import { setAdmin } from "../features/auth/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

export default function VideoCapture() {
  const dispatch = useDispatch();
  const videoRef = useRef(null);
  const ws = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  let animationFrameId = useRef(null);
  let stream = useRef(null);

  useEffect(() => {
    // Open WebSocket connection when component mounts
    ws.current = new WebSocket("ws://localhost:8000/ws/video-stream/");

    // Handle WebSocket connection open event
    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    // Clean up WebSocket connection when component unmounts
    return () => {
      ws.current.close();
      stopVideoStream(); // Stop video stream before unmounting
    };
  }, []);

  const startVideoStream = async () => {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream.current;

      // Start sending video frames to the backend
      sendVideoFrames();
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.message === "done") {
          if (Number(data.count) >= 25) {
            dispatch(setAdmin(true));
            navigate("/login/admin");
          } else {
            setError(true);
          }
        }
      };
    } catch (error) {
      console.error("Error accessing video stream:", error);
    }
  };

  const stopVideoStream = () => {
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop());
    }
  };

  const sendVideoFrames = () => {
    if (videoRef.current && ws.current.readyState === WebSocket.OPEN) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Draw video frame onto canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas image to Blob
      canvas.toBlob((blob) => {
        ws.current.send(blob); // Send Blob object through WebSocket
      }, "image/jpeg");
    }

    // Continue sending frames recursively
    animationFrameId.current = requestAnimationFrame(sendVideoFrames);
  };

  useEffect(() => {
    startVideoStream();

    // Clean up animation frame when component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen uppercase">
        <p className="mb-[3.5rem] text-2xl font-semibold text-center">
          Admin verification
        </p>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full max-w-md border border-gray-300 rounded-lg shadow-lg"
        ></video>
        {error && (
          <div className="mt-[3.4rem] uppercase font-medium text-2xl text-red-700">
            You are not the admin
          </div>
        )}
      </div>
    </div>
  );
}
