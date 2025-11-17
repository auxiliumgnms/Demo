import { WasteCategory } from "@shared/schema";

// Check if speech synthesis is supported
const isSpeechSupported = 'speechSynthesis' in window;

// Speak the classification result
export function speakResult(category: WasteCategory): void {
  if (!isSpeechSupported) {
    console.warn('Speech synthesis not supported in this browser');
    return;
  }

  try {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create utterance with instruction
    const message = `Please place this item in the ${category} bin.`;
    const utterance = new SpeechSynthesisUtterance(message);
    
    // Set language to English
    utterance.lang = 'en-US';
    
    // Optional: Adjust speech parameters
    utterance.volume = 1; // 0 to 1
    utterance.rate = 1; // 0.1 to 10
    utterance.pitch = 1; // 0 to 2
    
    // Speak the message
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error('Speech synthesis error:', error);
  }
}

// Check if speech synthesis is available
export function checkSpeechSupport(): boolean {
  return isSpeechSupported;
}
