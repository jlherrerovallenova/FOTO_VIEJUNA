import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string suitable for the Gemini API.
 */
export const fileToGenerativePart = async (file: File): Promise<{ data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        data: base64Data,
        mimeType: file.type,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Calls Gemini to colorize the provided image.
 */
export const colorizeImage = async (file: File): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(file);

    const prompt = `
      You are an expert photo restorer. 
      Take this black and white image and colorize it realistically. 
      Make it look like a high-quality photo taken today with a modern camera. 
      Pay close attention to skin tones, clothing textures, and environmental lighting. 
      Do not alter the content, geometry, or composition of the image, only the colors.
      Return the image itself.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imagePart.data,
              mimeType: imagePart.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Extract the image from the response
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No image generated.");
    }

    // Iterate through parts to find the image
    for (const part of candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("The model did not return an image part.");

  } catch (error) {
    console.error("Error colorizing image:", error);
    throw error;
  }
};
