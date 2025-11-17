// Camera utility functions

// Set up the camera with the specified facing mode
export async function setupCamera(facingMode: 'user' | 'environment' = 'environment'): Promise<MediaStream> {
  // Check if camera is supported
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error('Camera not supported by your browser');
  }

  try {
    // Get media stream with specified constraints
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    };

    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    console.error('Error accessing camera:', error);
    
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        throw new Error('Camera access denied. Please grant permission to use your camera.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No camera found on your device.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Camera is already in use by another application.');
      }
    }
    
    throw new Error('Could not access camera. Please try again or use a different device.');
  }
}

// Switch between front and back camera
export async function switchCameraFacingMode(facingMode: 'user' | 'environment'): Promise<MediaStream> {
  return await setupCamera(facingMode);
}

// Convert a video frame to a Blob
export function captureFrame(video: HTMLVideoElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas with video dimensions
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to blob
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to capture image'));
        }
      }, 'image/jpeg', 0.95);
    } catch (error) {
      reject(error);
    }
  });
}
