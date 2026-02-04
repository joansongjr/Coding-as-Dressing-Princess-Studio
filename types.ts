
export interface AnalysisResult {
  generatedCode: string;
  fashionInterpretation: string;
  imagePrompt: string;
  attributes: {
    elegance: number;
    clarity: number;
    power: number;
  };
}

export interface FileEntry {
  id: string;
  name: string;
  language: string;
  content: string;
}
