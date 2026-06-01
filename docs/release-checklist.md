# Release Checklist

Use this checklist before publishing `@nexa-llc/kyaraflip-avatar-react` or
tagging a public release.

## Package Checks

- Confirm `package.json` name, version, license, repository, exports, and files.
- Run `pnpm install` if dependencies changed.
- Run `pnpm run check`.
- Run `pnpm run build`.
- Confirm source exports and `dist/` output are aligned.
- Confirm `dist/index.d.ts` includes the expected public types.

## Visual Checks

- Render at least two `Avatar` sizes.
- Check round and square avatar paths.
- Check one geometric variant and one animal variant.
- Open `examples/live-card-shooter.html` after building when Live Card code
  changes.
- Confirm keyboard controls still work: arrows, Space, and `R`.

## Documentation Checks

- Update README examples when public props or exports change.
- Update `docs/codex-game-development.md` when game-facing workflow changes.
- Update `SECURITY.md` if reporting or maintenance expectations change.

## Release Notes

Summarize:

- User-visible component changes.
- New or removed exports.
- Generated output changes.
- Known visual or testing gaps.
