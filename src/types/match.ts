import type { AuntieProfile } from "./parse";

export interface MatchRequirement {
  position: string;
  district: string;
  skills: string[];
  salaryRange: { min: number; max: number };
  experience: number;
}

export interface MatchDimension {
  key: string;
  label: string;
  weight: number;
  score: number;
}

export interface MatchCandidate {
  profile: AuntieProfile;
  dimensions: MatchDimension[];
  hardScore: number;
  softScore: number;
  totalScore: number;
  recommendation: string;
  rank: number;
}
