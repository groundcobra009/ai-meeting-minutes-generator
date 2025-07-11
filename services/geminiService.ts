
import { GoogleGenAI } from "@google/genai";
import { OutputType } from '../types';
import { SUMMARY_TEMPLATES } from '../types/templates';

let aiInstance: GoogleGenAI | null = null;

export const initializeGeminiAI = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API key is required");
  }
  aiInstance = new GoogleGenAI({ apiKey });
};

// Helper to convert a File object to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The result includes the Base64 prefix "data:audio/mpeg;base64,", so we split it off.
      const base64Data = (reader.result as string).split(',')[1];
      resolve(base64Data);
    };
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: {
      mimeType: file.type,
      data: await base64EncodedDataPromise,
    },
  };
}

const getPromptByTemplateId = (templateId: string, fileName: string) => {
  const template = SUMMARY_TEMPLATES.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template with id ${templateId} not found`);
  }
  
  // Replace {fileName} placeholder in the prompt
  return template.prompt.replace(/{fileName}/g, fileName);
};

export const generateContent = async (
  file: File,
  templateId: string,
  apiKey?: string
): Promise<string> => {
  try {
    // Initialize with provided API key if not already initialized
    if (apiKey && !aiInstance) {
      initializeGeminiAI(apiKey);
    }
    
    if (!aiInstance) {
      throw new Error("Gemini AI が初期化されていません。APIキーを設定してください。");
    }

    const audioPart = await fileToGenerativePart(file);
    const promptText = getPromptByTemplateId(templateId, file.name);

    const contents = [{ text: promptText }, audioPart];

    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    if (error instanceof Error) {
      return `エラーが発生しました: ${error.message}`;
    }
    return "不明なエラーが発生しました。";
  }
};
