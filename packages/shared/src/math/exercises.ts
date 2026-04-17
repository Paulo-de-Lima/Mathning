import type { ArithmeticProblem, Operation } from "../types.js";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** tier 1: números pequenos; 2 e 3 aumentam o intervalo (base para adaptativo futuro) */
export function boundsForOperation(
  operation: Operation,
  tier: 1 | 2 | 3,
): { min: number; max: number } {
  const mult = tier;
  switch (operation) {
    case "add":
    case "subtract":
      return { min: 1, max: 9 * mult };
    case "multiply":
      return { min: 2, max: Math.min(12, 4 + mult * 4) };
    case "divide": {
      const divisor = randInt(2, Math.min(12, 3 + mult * 3));
      return { min: divisor, max: divisor }; // usado só para escolher divisor
    }
    default:
      return { min: 1, max: 9 };
  }
}

export function generateArithmeticProblem(
  operation: Operation,
  difficultyTier: 1 | 2 | 3 = 1,
): ArithmeticProblem {
  const tier = difficultyTier;
  switch (operation) {
    case "add": {
      const { min, max } = boundsForOperation("add", tier);
      const a = randInt(min, max);
      const b = randInt(min, max);
      return { a, b, operation: "add", answer: a + b };
    }
    case "subtract": {
      const { min, max } = boundsForOperation("subtract", tier);
      const a = randInt(min, max);
      const b = randInt(1, a);
      return { a, b, operation: "subtract", answer: a - b };
    }
    case "multiply": {
      const { min, max } = boundsForOperation("multiply", tier);
      const a = randInt(min, max);
      const b = randInt(min, max);
      return { a, b, operation: "multiply", answer: a * b };
    }
    case "divide": {
      const divisor = randInt(2, Math.min(12, 3 + tier * 3));
      const quotient = randInt(2, 12);
      const a = divisor * quotient;
      return { a, b: divisor, operation: "divide", answer: quotient };
    }
  }
}

export function parseUserAnswer(input: string): number | null {
  const t = input.trim().replace(",", ".");
  if (t === "") return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 1000) / 1000;
}

export function answersMatch(user: number, correct: number): boolean {
  return Math.abs(user - correct) < 1e-6;
}

export function formatProblem(p: ArithmeticProblem): string {
  const sym =
    p.operation === "add"
      ? "+"
      : p.operation === "subtract"
        ? "−"
        : p.operation === "multiply"
          ? "×"
          : "÷";
  return `${p.a} ${sym} ${p.b}`;
}

export function explainSolution(p: ArithmeticProblem): string {
  switch (p.operation) {
    case "add":
      return `Some os dois números: ${p.a} + ${p.b} = ${p.answer}.`;
    case "subtract":
      return `Subtraia o segundo do primeiro: ${p.a} − ${p.b} = ${p.answer}.`;
    case "multiply":
      return `Multiplique: ${p.a} × ${p.b} = ${p.answer}.`;
    case "divide":
      return `Divida o primeiro pelo segundo: ${p.a} ÷ ${p.b} = ${p.answer}.`;
    default:
      return `O resultado é ${p.answer}.`;
  }
}
