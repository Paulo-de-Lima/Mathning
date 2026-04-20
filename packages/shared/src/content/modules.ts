import type { LearningModule } from "../types.js";
import {
  ALGEBRA_MODULE,
  FRACTIONS_DECIMALS_MODULE,
  FOUNDATIONS_MODULE,
  GEOMETRY_MODULE,
  LOGIC_MODULE,
  MEASURES_MODULE,
} from "./conceptCurriculum.js";

const BASIC_OPS_MODULE: LearningModule = {
  id: "basic-ops",
  title: "Operações básicas",
  description:
    "Adição, subtração, multiplicação e divisão com números simples — base para tudo que vem depois.",
  available: true,
  lessons: [
    {
      id: "add",
      title: "Adição",
      summary:
        "Juntar quantidades: se você tem 2 maçãs e ganha mais 3, fica com 5. O símbolo é +.",
      operation: "add",
      difficultyTier: 1,
    },
    {
      id: "subtract",
      title: "Subtração",
      summary:
        "Tirar uma quantidade da outra: 10 reais menos 3 reais sobram 7. O símbolo é −.",
      operation: "subtract",
      difficultyTier: 1,
    },
    {
      id: "multiply",
      title: "Multiplicação",
      summary:
        "Somar várias vezes a mesma quantidade: 4 grupos de 2 bolinhos = 8. O símbolo é ×.",
      operation: "multiply",
      difficultyTier: 1,
    },
    {
      id: "divide",
      title: "Divisão",
      summary:
        "Repartir em partes iguais: 12 doces para 3 pessoas, cada uma leva 4. O símbolo é ÷.",
      operation: "divide",
      difficultyTier: 1,
    },
  ],
};

/** Ordem pedagógica: fundamentos → operações → frações → medidas → geometria → álgebra → lógica. */
export const MODULES: LearningModule[] = [
  FOUNDATIONS_MODULE,
  BASIC_OPS_MODULE,
  FRACTIONS_DECIMALS_MODULE,
  MEASURES_MODULE,
  GEOMETRY_MODULE,
  ALGEBRA_MODULE,
  LOGIC_MODULE,
];

export function getModuleById(id: string): LearningModule | undefined {
  return MODULES.find((m) => m.id === id);
}

export function getLesson(moduleId: string, lessonId: string) {
  const mod = getModuleById(moduleId);
  return mod?.lessons.find((l) => l.id === lessonId);
}
