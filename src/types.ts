export interface Feedback {
  id: string;
  name: string;
  contact: string;
  rating: number;
  content: string;
  timestamp: string;
  isOfficialCoCreator: boolean;
}

export interface PromptTemplate {
  id: string;
  title: string;
  category: "logic" | "creation" | "knowledge" | "context";
  promptText: string;
  steps: string[];
  finalResponse: string;
  cost: number;
}

export interface MoyuanState {
  points: number;
  maxPoints: number;
  tickets: number;
  isVip: boolean;
  vipCode: string;
  coCreatorRank: "Normal" | "Contributor" | "Elder" | "Supreme Co-Creator";
  totalSimulations: number;
}
