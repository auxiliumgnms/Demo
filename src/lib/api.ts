import { ClassificationResult } from "@shared/schema";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const classifyEndpoint = apiBaseUrl ? `${apiBaseUrl}/api/classify` : "/api/classify";

// Function to send image to backend for classification
export async function classifyImage(imageBlob: Blob): Promise<ClassificationResult> {
  try {
    // Create FormData to send the image
    const formData = new FormData();
    formData.append("image", imageBlob);

    // Send request to backend (relative in dev, absolute in static builds)
    const response = await fetch(classifyEndpoint, {
      method: "POST",
      body: formData,
    });

    // Check if request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    // Parse and return classification result
    const data = await response.json();
    return data as ClassificationResult;
  } catch (error) {
    console.error("Error classifying image:", error);
    throw error;
  }
}
