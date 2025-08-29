# Repository Guidelines

## Project Structure & Module Organization

- `src/core`: Domain models, ports, and use‑cases (framework‑agnostic). No Next.js or Mongoose imports.
- `src/infrastructure`: Adapters (Mongo/Mongoose models & repos, auth, AI, seeders).
- `src/interface`: HTTP entrypoints (Next App Router handlers) that call use‑cases.
- `src/app`: UI and pages; only talks to `src/interface`.
- `scripts/`: Dev/ops utilities.
- Config: `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`.

## Build, Test, and Development Commands

- `npm run dev`: Start Next.js with HMR for local development.
- `npm run build`: Production build.
- `npm start`: Run the built app.
- `npm test`: Execute the test suite.
- `npm run lint` / `npm run format`: Lint and format the codebase.

## Coding Style & Naming Conventions

- TypeScript strict; small, single‑responsibility functions.
- Respect hexagonal boundaries: `core` (pure), `infrastructure` (adapters), `interface` (HTTP wiring).
- Naming: use‑cases `verb-noun` (e.g., `create-reservation.use-case.ts`); repos `ReservationRepo*`.
- Linting/formatting: ESLint + Prettier. Prefer explicit types; avoid `any`.

## Testing Guidelines

- Framework: jest/vitest with in‑memory repos (no network/DB).
- Names: `*.spec.ts` (unit), `*.e2e.ts` (integration). Place near code or under `tests/` mirroring structure.
- Aim for critical‑path coverage (domain rules, repos, API handlers). Run with `npm test`.

## Commit & Pull Request Guidelines

- Commits: `feat:`, `fix:`, `refactor:`, `chore:` — concise, imperative.
- PRs: clear description, linked issues, reproduction/validation steps; screenshots for UI.
- Note scope of changes and any breaking changes/migrations.

## Architecture & Persistence Notes

- Business rules: 1/day, max 2/week per user — enforced in use‑cases and DB constraints.
- Mongoose models:
  - `Timeslot { dateISO, hour, room, capacity, reservedCount }` with unique `(dateISO,hour,room)`.
  - `Reservation { userId, dateISO, timeslotId, room }` with unique `(userId,dateISO)`.
- Atomic capacity check: increment `reservedCount` only when `< capacity` via `$expr`.

## Security & Configuration

- Do not commit `.env.local` or secrets; follow least‑privilege for DB users.
- Validate inputs at the `interface` layer; sanitize user data.
- Keep configuration in environment variables and document required keys in README.

## Invariantes de Arquitectura (OBLIGATORIO)

- Hexagonal/Clean:
  - `src/core` = dominio + aplicación (puertos/use-cases). **Prohibido** importar Next, Mongoose, HTTP, UI.
  - `src/infrastructure` = adaptadores (Mongoose, OpenAI, auth). Implementan puertos, NO reglas de dominio.
  - `src/interface` = delivery HTTP (App Router) que llama casos de uso vía puertos.
  - `src/app` = UI. Nunca contiene lógica de dominio.
- SOLID:
  - SRP en casos de uso; sin “clase dios”.
  - DIP: casos de uso dependen **solo** de interfaces/puertos.
  - ISP: puertos pequeños y específicos.
  - OCP: variaciones por polimorfismo/estrategias, no por `if tipo`.
- Calidad:
  - TypeScript estricto; funciones cortas; sin side-effects en dominio.
  - Tests con repos “in-memory” (LSP).
- Persistencia:
  - Índices únicos: Timeslot (dateISO,hour,room); Reservation (userId,dateISO) y (userId,timeslotId).
  - Incremento de cupos: update atómico con `$expr (reservedCount < capacity)`.
- Política de cambios:
  - **Mostrar DIFF** antes de escribir.
  - No tocar `.env.local` ni secretos.
