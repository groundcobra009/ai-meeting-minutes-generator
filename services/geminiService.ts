
import { GoogleGenAI } from "@google/genai";
import { OutputType } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

const getPrompt = (outputType: OutputType, fileName: string) => {
  if (outputType === OutputType.MINUTES) {
    return `あなたはプロの書記です。以下の音声データから、会話形式の議事録を作成してください。

# 指示
- 話者名を明確に記載してください（例：話者A、話者B）。
- 発言は「話者A: [発言内容]」の形式で記載してください。
- 誤字脱字を修正してください。
- 口語的な表現は適切な文語に変換してください。
- 「あー」「えー」などのフィラーは削除してください。

# 出力構成
## 会議情報
- 日時: (不明な場合は「不明」と記載)
- 場所/形式: (不明な場合は「不明」と記載)
- 参加者: (音声から特定できる範囲で記載)
- 議題: ${fileName} に関する会議

## 議事内容
(ここに話者ごとの発言を記載)

## 決定事項
1. [決定事項1]
2. ...

## ネクストアクション
- [アクション内容]（担当：[担当者名]、期限：[日付]）
- ...
`;
  } else {
    return `あなたは優秀なビジネスアナリストです。以下の音声データから、簡潔で分かりやすい議事概要を作成してください。

# 指示
- 重要なポイントのみを抽出してください。
- 箇条書きで簡潔に記載してください。
- 5W1Hを意識して記載してください。

# 出力構成
## 議事概要 - ${fileName}

### 概要
会議の目的と主な議論内容を2-3文で要約してください。

### 決定事項
- [決定事項1]
- [決定事項2]
- ...

### ネクストアクション
- [何を]：[誰が]が[いつまでに]実施
- ...
`;
  }
};

export const generateContent = async (
  file: File,
  outputType: OutputType
): Promise<string> => {
  try {
    const audioPart = await fileToGenerativePart(file);
    const promptText = getPrompt(outputType, file.name);

    const contents = [{ text: promptText }, audioPart];

    const response = await ai.models.generateContent({
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
