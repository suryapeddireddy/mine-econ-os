# Development Workflow Rules

## Approach

Build MineEcon-OS incrementally using a spec-driven workflow. Context files define what to build, how to build it, and what the current state of progress is. Always implement against these specs — do not infer or invent behavior from scratch.

## Scoping Rules

- Work on one feature unit or subsystem at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step.

## Handling Missing Requirements

- Do not invent financial formulas or product behavior that contradicts GATE syllabus standards.
- If a calculation or requirement is ambiguous, update the context files before implementing.
- Record open questions in `progress-tracker.md`.

## Keeping Docs In Sync

Update the relevant context file whenever implementation changes:
- System architecture or calculation logic
- Storage model decisions
- Code conventions or standards
- Feature scope

`progress-tracker.md` must accurately reflect the real implementation state.