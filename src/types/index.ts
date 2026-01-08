export type MBTIDimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

export type MBTIType =
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export interface Question {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  text: string;
  optionA: {
    text: string;
    type: MBTIDimension;
  };
  optionB: {
    text: string;
    type: MBTIDimension;
  };
}

export interface Answer {
  questionId: number;
  selected: 'A' | 'B';
  dimension: MBTIDimension;
}

export interface MBTIResult {
  type: MBTIType;
  nickname: string;
  summary: string;
  characteristics: string[];
  strengths: string[];
  weaknesses: string[];
  recommendedJobs: string[];
  celebrities: string[];
  percentage: number;
}

export interface Statistics {
  totalCount: number;
  distribution: Record<MBTIType, number>;
}
