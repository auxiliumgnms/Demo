import { useState } from "react";
import CameraViewer from "./CameraViewer";
import ResultsDisplay from "./ResultsDisplay";
import ErrorMessage from "./ErrorMessage";
import VoiceFeedbackToggle from "./VoiceFeedbackToggle";
import { WasteCategory } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { classifyImage } from "@/lib/api";
import { speakResult } from "@/lib/speech";

export default function RecyclingKiosk() {
  const [isVoiceFeedbackEnabled, setIsVoiceFeedbackEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [classification, setClassification] = useState<WasteCategory | null>(null);

  const classifyMutation = useMutation({
    mutationFn: (imageBlob: Blob) => classifyImage(imageBlob),
    onSuccess: (data) => {
      setClassification(data.category);
      if (isVoiceFeedbackEnabled) {
        speakResult(data.category);
      }
      setErrorMessage(null);
    },
    onError: (error) => {
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : "Failed to classify the image. Please try again."
      );
      setClassification(null);
    },
  });

  const handleCapture = async (imageBlob: Blob) => {
    // Create a data URL for display
    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result as string);
    };
    reader.readAsDataURL(imageBlob);

    // Send to API for classification
    classifyMutation.mutate(imageBlob);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setClassification(null);
    setErrorMessage(null);
  };

  const toggleVoiceFeedback = (enabled: boolean) => {
    setIsVoiceFeedbackEnabled(enabled);
    // If result is already showing and we enable voice, speak it
    if (enabled && classification) {
      speakResult(classification);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 lg:p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-primary text-4xl mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 19H5V8.7C5 8.3 5.2 7.9 5.5 7.6L9 4L9.8 4.8C10.1 5.1 10.1 5.5 9.8 5.8L7 8.7V19Z" />
              <path d="M15 19V5H17.2C17.6 5 18 5.2 18.4 5.4L21.3 7.4C21.7 7.7 22 8.1 22 8.5C22 9 21.5 9.4 21.1 9.2L18 8V19H15Z" />
              <path d="M11 19V2L13 2V19H11Z" />
            </svg>
          </span>
          <h1 className="text-2xl font-bold text-neutral-400">Recycling Classifier</h1>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-neutral-400">Announce</span>
          <VoiceFeedbackToggle 
            enabled={isVoiceFeedbackEnabled} 
            onChange={toggleVoiceFeedback} 
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        {/* Camera Section */}
        <CameraViewer 
          onCapture={handleCapture} 
          onReset={handleReset}
          capturedImage={capturedImage}
          isLoading={classifyMutation.isPending}
        />

        {/* Results Section - shown when we have a classification */}
        {classification && (
          <ResultsDisplay category={classification} />
        )}

        {/* Error Message - shown when there's an error */}
        {errorMessage && (
          <ErrorMessage message={errorMessage} />
        )}
      </main>

      {/* Instructions Footer */}
      <footer className="mt-auto pt-4 border-t border-neutral-200">
        <div className="grid grid-cols-3 gap-4 mb-2 text-center">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3" />
            </svg>
            <p className="text-xs text-neutral-300">Take Photo</p>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              <circle cx="10" cy="13" r="2" />
              <path d="M14 13h4" />
              <path d="M14 9h4" />
              <path d="M14 17h4" />
            </svg>
            <p className="text-xs text-neutral-300">Identify Material</p>
          </div>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
            <p className="text-xs text-neutral-300">Recycle Properly</p>
          </div>
        </div>
        <p className="text-center text-xs text-neutral-300 mt-2">
          This recycling kiosk uses computer vision to help you sort your waste correctly.
        </p>
      </footer>
    </div>
  );
}
