import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { GeneratedImage, ViewType } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            reject(new Error('Failed to read file as base64 string.'));
        }
    };
    reader.onerror = error => reject(error);
  });
};


const callGeminiForImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: { data: base64Image, mimeType } },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    throw new Error(`圖片生成失敗: ${prompt}。模型未回傳圖片。`);
};


export const generateAllViews = async (
    file: File,
    setProgress: (message: string) => void
): Promise<GeneratedImage[]> => {

    setProgress('正在讀取圖片...');
    const base64Image = await fileToBase64(file);
    const mimeType = file.type;
    
    setProgress('正在去除背景...');
    const noBgBase64 = await callGeminiForImage(
        base64Image,
        mimeType,
        '請移除這張圖片的背景，只保留主要物體。背景應該是透明的。不要在圖片中加入任何文字。'
    );

    const results: GeneratedImage[] = [{
        view: ViewType.NO_BACKGROUND,
        src: `data:${mimeType};base64,${noBgBase64}`
    }];

    const viewPrompts = new Map<ViewType, string>([
        [ViewType.TOP, '以正投影視圖的規則，生成此物體的俯視圖。圖像應該只包含物體本身，背景為透明，且圖像中不能有任何文字或標籤。'],
        [ViewType.BOTTOM, '以正投影視圖的規則，生成此物體的仰視圖。圖像應該只包含物體本身，背景為透明，且圖像中不能有任何文字或標籤。'],
        [ViewType.RIGHT, '以正投影視圖的規則，生成此物體的右視圖（從右側觀看）。圖像應該只包含物體本身，背景為透明，且圖像中不能有任何文字或標籤。'],
        [ViewType.FRONT, '以正投影視圖的規則，生成此物體的主視圖。圖像應該只包含物體本身，背景為透明，且圖像中不能有任何文字或標籤。'],
        [ViewType.LEFT, '以正投影視圖的規則，生成此物體的左視圖（從左側觀看）。圖像應該只包含物體本身，背景為透明，且圖像中不能有任何文字或標籤。'],
        [ViewType.BACK, '以正投影視圖的規則，生成此物體的後視圖。圖像應該只包含物體本身，背景為透明，且圖像中不能有任何文字或標籤。'],
    ]);

    const generationPromises = Array.from(viewPrompts.entries()).map(async ([view, prompt], index) => {
        setProgress(`正在生成視圖 (${index + 1}/${viewPrompts.size}): ${view}...`);
        try {
            const generatedImgBase64 = await callGeminiForImage(noBgBase64, mimeType, prompt);
            return {
                view,
                src: `data:${mimeType};base64,${generatedImgBase64}`
            };
        } catch (error) {
            console.error(`Failed to generate view: ${view}`, error);
            // Return a placeholder or skip this image on error
            return null;
        }
    });
    
    const generatedViews = (await Promise.all(generationPromises)).filter(Boolean) as GeneratedImage[];
    
    return [...results, ...generatedViews];
};