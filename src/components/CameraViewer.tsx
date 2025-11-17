import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { setupCamera, switchCameraFacingMode } from "@/lib/camera";

interface CameraViewerProps {
  onCapture: (imageBlob: Blob) => void;
  onReset: () => void;
  capturedImage: string | null;
  isLoading: boolean;
}

export default function CameraViewer({ onCapture, onReset, capturedImage, isLoading }: CameraViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Initialize camera on component mount
  useEffect(() => {
    initializeCamera();
    
    // Cleanup function to stop camera stream when component unmounts
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize or reinitialize camera
  const initializeCamera = async () => {
    try {
      setCameraError(null);
      const stream = await setupCamera(facingMode);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraStream(stream);
    } catch (error) {
      console.error("Error setting up camera:", error);
      setCameraError(
        error instanceof Error 
          ? error.message 
          : "Could not access camera. Please ensure you have granted permission."
      );
    }
  };

  // Handle camera switch button click
  const handleSwitchCamera = async () => {
    // Stop current stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    
    // Toggle facing mode
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacingMode);
    
    // Restart camera with new facing mode
    try {
      const stream = await switchCameraFacingMode(newFacingMode);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setCameraStream(stream);
    } catch (error) {
      console.error("Error switching camera:", error);
      setCameraError(
        error instanceof Error 
          ? error.message 
          : "Could not switch camera. Your device might only have one camera."
      );
    }
  };

  // Capture photo from video stream
  const handleCaptureClick = () => {
    if (!videoRef.current || !canvasRef.current || !cameraStream) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob and send to parent
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  return (
    <section className="mb-6 flex-grow flex flex-col">
      <div className="relative flex-grow flex flex-col bg-black rounded-lg overflow-hidden shadow-lg border-2 border-neutral-200">
        {/* Camera View / Image Preview */}
        <div className="relative flex-grow flex items-center justify-center bg-neutral-400">
          {/* Video element for camera stream */}
          <video 
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover ${capturedImage ? 'hidden' : ''}`}
            autoPlay 
            playsInline
          />
          
          {/* Canvas for photo capture (hidden) */}
          <canvas 
            ref={canvasRef}
            className="hidden"
          />
          
          {/* Image preview when photo is captured */}
          {capturedImage && (
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Initial state when no camera */}
          {!cameraStream && !capturedImage && !cameraError && (
            <div className="text-center text-white p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
              <p className="text-xl">Camera will appear here</p>
              <p className="text-sm mt-2">Please allow camera access when prompted</p>
            </div>
          )}
          
          {/* Camera error state */}
          {cameraError && (
            <div className="text-center text-white p-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-2 text-error" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-xl text-error">Camera Error</p>
              <p className="text-sm mt-2">{cameraError}</p>
              <Button 
                className="mt-4 bg-primary hover:bg-primary/90"
                onClick={initializeCamera}
              >
                Try Again
              </Button>
            </div>
          )}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="text-center text-white">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid"></div>
                <p className="mt-4 text-xl">Analyzing your item...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Camera Controls */}
        <div className="p-4 bg-neutral-400 text-white flex justify-between items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwitchCamera}
            className="text-white hover:bg-white/20 rounded-full"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 4h6v6" />
              <path d="M3 10 9 4" />
              <path d="M21 20h-6v-6" />
              <path d="M21 14l-6 6" />
              <path d="M9 20v-3.5A2.5 2.5 0 0 1 11.5 14H13" />
              <path d="M11 3.5A2.5 2.5 0 0 1 13.5 6H15" />
            </svg>
          </Button>
          
          {!capturedImage ? (
            <Button
              onClick={handleCaptureClick}
              className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg p-0"
              variant="outline"
              size="icon"
              disabled={!cameraStream || isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
              </svg>
            </Button>
          ) : (
            <Button
              onClick={onReset}
              className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg p-0"
              variant="outline"
              size="icon"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 2v6h6" />
                <path d="M3 13a9 9 0 1 0 3-7.7L3 8" />
              </svg>
            </Button>
          )}
          
          <div className="w-10">
            {/* Spacer to balance layout */}
          </div>
        </div>
      </div>
    </section>
  );
}
