export interface GeneratedSite {
  html: string;
  explanation: string;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  site?: GeneratedSite;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}
