export interface Option {
  label: string;
  score: number;
}

export interface Question {
  id: string;
  text: string;
  hint?: string;
  options: Option[];
  multiSelect?: boolean;
}

export interface Section {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
  questions: Question[];
}

export interface SectionScore {
  sectionId: string;
  sectionName: string;
  rawScore: number;
  maxScore: number;
  percentage: number;
  weight: number;
  weightedScore: number;
}

export interface QuestionnaireResult {
  sectionScores: SectionScore[];
  overallScore: number;
  riskBand: string;
  profileSlug: 'conservative' | 'balanced' | 'aggressive';
}
