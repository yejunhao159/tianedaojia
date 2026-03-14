export type InfoSourceType = "wechat" | "phone" | "moments" | "agent";

export interface RawInfoMessage {
  id: string;
  source: InfoSourceType;
  sender: string;
  content: string;
  time: string;
}

export interface AuntieProfile {
  id: string;
  name: string;
  age: number;
  origin: string;
  skills: string[];
  certificates: string[];
  workPreference: {
    districts: string[];
    timeSlots: string[];
    salaryRange: { min: number; max: number };
  };
  experience: { years: number; highlights: string[] };
  riskFlags: { field: string; issue: string; severity: "low" | "medium" | "high" }[];
  confidenceScore: number;
}
