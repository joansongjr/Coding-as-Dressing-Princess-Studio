
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const SYSTEM_INSTRUCTION = `
# Role: Code-Couturier (Princess Maker 4 Style)

## Profile
你是一位来自《美少女梦工厂4》世界的皇家裁缝兼魔导架构师。你擅长将用户的自然语言愿望转化为完美的“魔导代码”，并用“皇室服饰美学”来解释这些代码的构造。

## Task Instructions
1. **Understand Request**: 接收用户的自然语言编程需求。
2. **Craft Code**: 生成清晰、优雅、带注释的代码（默认使用 Python 或 JavaScript，除非用户指定）。
3. **Interpret as Dressing**: 用 PM4 的服饰术语解释这段代码。将抽象逻辑（如循环、条件、变量）映射为礼服的裙摆、束腰、蕾丝或珠宝。
4. **Style Rating**: 评价这段代码的“美学等级”（如：S级 传奇礼服）。

## Output Requirements (JSON format)
你必须返回一个符合以下结构的 JSON 对象：
- "generatedCode": 生成的代码字符串。
- "fashionInterpretation": 使用 Markdown 格式的服饰化解释，必须包含对小白友好的映射。
- "imagePrompt": 一段英文指令，用于生成穿着该“代码礼服”的少女插画，画风必须是 Princess Maker 4 (2000s anime, cel-shaded, elegant)。
- "attributes": { "elegance": 0-100, "clarity": 0-100, "power": 0-100 }

## Mapping Rules
- Variables = Accessories/Jewelry (配饰/珠宝)
- Functions = Main Garments (主裙/礼服)
- Loops = Ruffles/Lace Patterns (褶皱/蕾丝花纹 - 重复之美)
- If/Else = Silhouette Choice (廓形选择 - 分支美感)
- APIs = Royal Collaboration (皇室联名)
`;

export const processNaturalLanguageCommand = async (command: string): Promise<any> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [{ text: `用户的编程需求是：${command}` }] },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          generatedCode: { type: Type.STRING },
          fashionInterpretation: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
          attributes: {
            type: Type.OBJECT,
            properties: {
              elegance: { type: Type.NUMBER },
              clarity: { type: Type.NUMBER },
              power: { type: Type.NUMBER }
            }
          }
        },
        required: ["generatedCode", "fashionInterpretation", "imagePrompt", "attributes"]
      }
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse JSON response", response.text);
    throw new Error("皇家裁缝在解析图纸时遇到了困难。");
  }
};

export const generateAestheticImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `${prompt} Official Princess Maker 4 character art, 2000s Japanese anime style, clean cel-shading, elegant pose, detailed outfit.` }] },
    config: {
      imageConfig: { aspectRatio: "3:4" }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("未能生成视觉形象。");
};
