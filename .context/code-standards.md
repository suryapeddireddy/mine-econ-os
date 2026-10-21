# Code Standards

## General

- Keep modules small, focused, and single-purpose.
- Maintain a strict boundary between UI rendering and financial mathematics.
- Respect system boundaries defined in `architecture-context.md`.

## TypeScript

- Strict mode enabled (`"strict": true`).
- Zero `any` types. All object contracts must be explicitly typed in `src/types/economics.ts`.
- Use interface for object shapes and type for unions/primitives.

## Math & Engineering Calculations

- All financial algebra must account for zero or negative values gracefully without throwing uncaught `NaN` errors or infinite recursion.
- Use explicit mathematical bounds (e.g., minimum values for discount rates or sinking fund rates to prevent division by zero).
- Include standard inline comments citing the specific GATE formula used (e.g., Hoskold's Two-Rate formula, Morkill formula, Lane Cut-Off equation).

## Component Guidelines

- Default to functional React components with explicit prop interfaces.
- Component state should be minimal and hoisted where necessary for workspace-wide synchronization.
- Chart components (`Recharts`) must handle responsive container sizing smoothly.