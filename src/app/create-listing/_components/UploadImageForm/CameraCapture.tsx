"use client";

import { useRef, useState, useEffect } from "react";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageFile: File) => void;
}

const CameraCapture = ({ isOpen, onClose, onCapture }: CameraCaptureModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          setStream(mediaStream);
        })
        .catch((err) => console.error("Camera access error:", err));
    }

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isOpen]);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_image.jpg", { type: "image/jpeg" });
            onCapture(file);
            onClose();
          }
        }, "image/jpeg");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-md shadow-md">
        <video ref={videoRef} autoPlay className="w-full h-auto rounded-md" />
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div className="flex justify-between mt-3">
          <button onClick={handleCapture} className="px-4 py-2 bg-green-600 text-white rounded-md">Take Photo</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
