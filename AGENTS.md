# AGENTS.md

KyaraFlip avatar React package 向けの作業ルールです。上位の `/Users/nariya/prj/web/AGENTS.md` も必ず読むこと。

## Project Scope

- This repository provides reusable KyaraFlip avatar components and bundled SVG assets for React.
- Keep package changes small and library-safe: no app-only state, no external asset hosting requirement, and no runtime dependency added without a clear reason.
- `dist/` is committed for git-based installs. When source or package entrypoints change, run the build and include the generated `dist/` update.

## Codex Game Development Workflow

Use the OpenAI Codex game development collection as the default lens for KyaraFlip/game-facing tasks:

- First playable loop: turn vague feature ideas into a minimal playable or inspectable loop before expanding scope.
- UI and controls: make one granular interaction/HUD/component adjustment at a time, then verify it visually.
- Hard game logic: create or reuse an evaluation loop for deterministic behavior before tuning algorithms.
- Bug triage: collect repro steps, logs, failing checks, and screenshots before patching.
- Review before merge: check for regressions, missing tests, and generated asset/build drift before pushing.

Local reference: `docs/codex-game-development.md`.

## Verification

- Run `pnpm run check` for type safety.
- Run `pnpm run build` when source, exports, package metadata, or committed build output may be affected.
- For visual/avatar changes, verify at least two sizes and both square/non-square rendering paths where relevant.
