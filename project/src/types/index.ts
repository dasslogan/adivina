export interface Riddle {
  id: number;
  question: string;
  answer: string;
}

export interface Player {
  id: string;
  nickname: string;
  guessTime: number;
  correctAnswers?: number;
}

export interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}