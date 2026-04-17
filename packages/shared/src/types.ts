export type Operation = "add" | "subtract" | "multiply" | "divide";

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  operation: Operation;
  /** Índice de dificuldade 1–3 (MVP: controla tamanho dos números) */
  difficultyTier: 1 | 2 | 3;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  /** Módulos futuros podem ficar bloqueados no MVP */
  available: boolean;
}

export interface ArithmeticProblem {
  a: number;
  b: number;
  operation: Operation;
  /** Resposta exata (inteiro quando aplicável) */
  answer: number;
}

export interface UserProgressDoc {
  xp: number;
  level: number;
  currentModuleId: string;
  currentLessonId: string;
  stats: {
    correct: number;
    wrong: number;
  };
  /** ISO date (YYYY-MM-DD) do último dia com atividade */
  lastActiveDate: string;
  /** Dias consecutivos com atividade */
  streak: number;
  /** Lições concluídas (ids) */
  completedLessonIds: string[];
  /** Data (YYYY-MM-DD) da contagem diária abaixo */
  dailyExerciseDate?: string;
  /** Exercícios feitos na data acima (meta diária) */
  dailyExerciseCount?: number;
}
