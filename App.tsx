/**
 * Fallback quando o Metro usa o projeto na raiz do monorepo (ex.: `npx expo start` sem `./apps/mobile`).
 * O ponto de entrada oficial continua sendo `apps/mobile/index.ts`.
 */
export { default } from "./apps/mobile/App";
