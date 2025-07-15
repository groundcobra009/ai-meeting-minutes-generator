
import { GoogleGenerativeAI } from "@google/generative-ai";
import { OutputType } from '../types';
import { SUMMARY_TEMPLATES } from '../types/templates';

let aiInstance: GoogleGenerativeAI | null = null;

// Configuration for API calls
const API_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  timeout: 300000, // 5 minutes
  generationConfig: {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 8192,
  },
};

export const initializeGeminiAI = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("API key is required");
  }
  aiInstance = new GoogleGenerativeAI(apiKey);
};

// Helper to convert a File object to a generative part.
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
  
  // Handle MP4 files by ensuring correct MIME type
  let mimeType = file.type;
  if (file.name.toLowerCase().endsWith('.mp4') || file.type === 'video/mp4') {
    // Gemini API expects audio/mp4 for audio content in MP4 container
    mimeType = 'audio/mp4';
  }
  
  return {
    inlineData: {
      mimeType: mimeType,
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

// Helper function to wait for a specified time
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to check if error is retryable
const isRetryableError = (error: any): boolean => {
  if (!error) return false;
  
  // Check for common retryable errors
  const errorMessage = error.message?.toLowerCase() || '';
  const retryableMessages = [
    'timeout',
    'network',
    'rate limit',
    '429',
    '503',
    '504',
    'temporarily unavailable',
  ];
  
  return retryableMessages.some(msg => errorMessage.includes(msg));
};

export const generateContent = async (
  file: File,
  templateId: string,
  apiKey?: string
): Promise<string> => {
  // Initialize with provided API key if not already initialized
  if (apiKey && !aiInstance) {
    initializeGeminiAI(apiKey);
  }
  
  if (!aiInstance) {
    throw new Error("Gemini AI が初期化されていません。APIキーを設定してください。");
  }

  const audioPart = await fileToGenerativePart(file);
  const promptText = getPromptByTemplateId(templateId, file.name);

  // Add system message for completion
  const enhancedPrompt = `${promptText}

重要: 必ず最後まで完全な内容を生成してください。途中で切れないよう、全ての項目を含めて回答してください。`;

  const contents = [{ text: enhancedPrompt }, audioPart];

  let lastError: Error | null = null;
  
  // Retry logic
  for (let attempt = 1; attempt <= API_CONFIG.maxRetries; attempt++) {
    try {
      console.log(`生成試行 ${attempt}/${API_CONFIG.maxRetries}...`);
      
      const model = aiInstance.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: API_CONFIG.generationConfig,
      });
      
      // Create chat session for better context handling
      const chat = model.startChat({
        history: [],
      });
      
      const result = await chat.sendMessage(contents);
      const text = result.response.text();
      
      // Check if response seems complete
      if (!text || text.length < 100) {
        throw new Error('レスポンスが不完全です。再試行します。');
      }
      
      // Check for common incomplete patterns
      const incompletePatterns = [
        /\.{3}$/,  // Ends with ...
        /[^。.!?]$/,  // Doesn't end with punctuation
        /続く$/,  // Ends with "to be continued"
      ];
      
      const seemsIncomplete = incompletePatterns.some(pattern => pattern.test(text.trim()));
      
      if (seemsIncomplete && attempt < API_CONFIG.maxRetries) {
        console.log('レスポンスが不完全な可能性があります。再試行します...');
        throw new Error('レスポンスが不完全です。');
      }
      
      return text;
    } catch (error) {
      console.error(`試行 ${attempt} でエラー:`, error);
      lastError = error as Error;
      
      // Don't retry if it's not a retryable error and we've tried once
      if (attempt > 1 && !isRetryableError(error)) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < API_CONFIG.maxRetries) {
        const waitTime = API_CONFIG.retryDelay * Math.pow(2, attempt - 1);
        console.log(`${waitTime}ms 後に再試行します...`);
        await delay(waitTime);
      }
    }
  }
  
  // All retries failed
  console.error("全ての試行が失敗しました:", lastError);
  if (lastError instanceof Error) {
    throw new Error(`生成に失敗しました (${API_CONFIG.maxRetries}回試行): ${lastError.message}`);
  }
  throw new Error("不明なエラーが発生しました。");
};
