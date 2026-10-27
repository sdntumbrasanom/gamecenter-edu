export type BloomLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';

export interface BloomDetail {
  code: BloomLevel;
  name: string;
  category: 'LOTS' | 'MOTS' | 'HOTS';
  desc: string;
  color: string;
}

export type PhaseType = 'Fase A' | 'Fase B' | 'Fase C' | 'Fase D' | 'Fase E' | 'Fase F' | 'Fondasi';

export interface PhaseInfo {
  id: PhaseType;
  title: string;
  grade: string;
  badgeColor: string;
}

export interface QuestionRow {
  id: string;
  question: string; // Kolom A
  correctAnswer: string; // Kolom B
  optionC: string; // Kolom C
  optionD: string; // Kolom D
  optionE: string; // Kolom E
  bloomLevel: string; // Kolom F
  explanation?: string; // Kolom G
}

export interface QuizDraft {
  id: string;
  title: string;
  phase: PhaseType;
  phaseGrade: string;
  subject: string;
  learningGoals: string;
  bloomLevels: string[];
  createdAt: string;
  questions: QuestionRow[];
}

export interface GameItem {
  id: string;
  title: string;
  description: string;
  githubUrl: string;
  playUrl: string; // URL used inside iframe
  imageUrl: string;
  phase: string;
  subject: string;
  supportsCustomQuiz: boolean;
  quizParamName?: string; // e.g. "quiz", "sheet", "url"
  isBuiltIn?: boolean;
  status?: 'ready' | 'pending_link'; // 'pending_link' for user games where link is "menyusul"
}

export interface TeacherProfile {
  email: string;
  name: string;
  authMethod: 'oauth_vertex' | 'api_key' | 'demo';
  accessToken?: string; // OAuth Access Token for Google Cloud Vertex AI (no API key needed)
  projectId?: string; // Google Cloud Project ID (e.g. gen-lang-client-0622433243)
  location?: string; // Vertex AI Region (e.g. us-central1, asia-southeast1)
  apiKey?: string; // Custom Gemini API Key fallback from Google AI Studio
  isLoggedIn: boolean;
  tokenObtainedAt?: number;
}

