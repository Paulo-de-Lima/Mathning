export type Operation = "add" | "subtract" | "multiply" | "divide";

/** Teoria rica para assuntos que não são só operações aritméticas. */
export interface ConceptTheoryBlock {
  title: string;
  body: string;
}

export interface ConceptTheoryVocabLine {
  term: string;
  definition: string;
}

export interface ConceptTheoryExample {
  id: string;
  title: string;
  expression?: string;
  visualLines?: string[];
  armedLines?: string[];
  explanation: string;
  note?: string;
}

export interface ConceptTheory {
  introTip?: string;
  conceptBlocks: ConceptTheoryBlock[];
  vocabulary: ConceptTheoryVocabLine[];
  ruleNotes: { title: string; text: string }[];
  examples: ConceptTheoryExample[];
}

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  operation: Operation;
  /** Índice de dificuldade 1–3 (MVP: controla tamanho dos números) */
  difficultyTier: 1 | 2 | 3;
  /** Se false, a tela de exercícios mostra aviso (teoria só). Padrão: true. */
  practiceEnabled?: boolean;
  /** Quando preenchido, o app usa fluxo de teoria conceitual em vez do fluxo de operações. */
  conceptTheory?: ConceptTheory;
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
