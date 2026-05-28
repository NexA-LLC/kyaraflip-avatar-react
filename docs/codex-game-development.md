# Codex Game Development Notes

Source: OpenAI Developers, "Game development" Codex use-case collection.

## How to Apply It in KyaraFlip

KyaraFlip work should use Codex as an implementation partner only after the playable target and verification signal are explicit enough to review. If a ticket is ambiguous, first clarify the intended loop, user action, expected visual result, and acceptance check.

For character/game-facing work, keep the production contract narrow:

- Keep simulation/state updates outside the renderer and expose a text/state inspection hook when practical.
- Put HUD, controls, and modal overlays in DOM instead of baking them into canvas/SVG scene art.
- Treat generated character assets as source artifacts: keep the original prompt/image/model and the converted browser asset together.
- For sprite or model changes, verify direction variants or motion states at two sizes, plus square and non-square avatar framing when the component supports both.
- For 3D character work, document the source model, converted `glb`/`vrm`/`fbx` output, motion source, and browser verification screenshot before review.

## Workflow

1. Build the first playable loop
   - Convert a brief into a small running browser experience with assets, controls, and a testable loop.
   - For this package, prefer a focused avatar/component fixture over a broad app scaffold.

2. Tune UI and controls
   - Make granular visual or interaction changes one at a time.
   - Verify the result in the browser or with a reviewable screenshot when the change is visual.
   - Keep HUD and control affordances as DOM where possible so game scene rendering stays reusable.

3. Tackle hard game logic
   - Put deterministic behavior behind a repeatable evaluation before iterating.
   - Keep random/avatar generation stable for the same seed unless the task explicitly changes that contract.

4. Triage bugs from real signals
   - Gather repro notes, failing checks, logs, screenshots, and affected variants before changing code.
   - Prioritize user-visible regressions and package contract breaks first.

5. Review before merge
   - Confirm source, types, package exports, and committed `dist/` output are aligned.
   - Call out missing tests or visual verification gaps in the PR summary.
   - Include generated-asset provenance and conversion notes when generated sprites or 3D models are introduced.

## Prompt Shape for Workers

Use this structure when delegating KyaraFlip game-facing work:

```text
Read AGENTS.md and docs/codex-game-development.md first.

Task:
- [concrete user/player outcome]

Context:
- Affected package/app:
- Existing files/components:
- Non-goals:

Acceptance:
- Playable or inspectable loop:
- Visual/behavioral checks:
- Commands to run:

If any of these are unclear, ask for clarification before editing.
```
