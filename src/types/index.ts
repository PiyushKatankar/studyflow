// ─── Task / Assignment ─────────────────────────────────────
export interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;          // ISO date string
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

// ─── Flashcard ─────────────────────────────────────────────
export interface Flashcard {
  id: string;
  front: string;            // question
  back: string;             // answer
}

export interface FlashcardDeck {
  id: string;
  name: string;
  emoji: string;
  cards: Flashcard[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizResult {
  total: number;
  correct: number;
}

// ─── Notes ─────────────────────────────────────────────────
export interface Note {
  id: string;
  title: string;
  content: string;          // markdown with LaTeX
  createdAt: string;        // ISO date string
  updatedAt: string;        // ISO date string
}

// ─── Pomodoro ──────────────────────────────────────────────
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSession {
  completedFocus: number;
  completedBreaks: number;
}

// ─── Tab Navigation ────────────────────────────────────────
export type TabKey = 'dashboard' | 'flashcards' | 'notes' | 'pomodoro';
