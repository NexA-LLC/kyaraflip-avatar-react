# `@nexa-llc/kyaraflip-avatar-react`

Reusable KyaraFlip avatar components for React and TypeScript.

This package exposes deterministic geometric avatar variants used in KyaraFlip,
cute cat and dog avatar variants backed by bundled SVG parts, and a small
Live Card shooter prototype that demonstrates how avatar identities can become
game-facing UI assets.

The package is designed for apps that need stable, privacy-friendly avatar
rendering without calling an external image service at runtime.

## Features

- Deterministic SVG avatars from a `name` seed.
- Geometric variants: `mosaic`, `orb`, and `beam`.
- Bundled KyaraFlip animal variants: `cat` and `dog`.
- SSR-safe React components with ESM, CommonJS, and TypeScript declarations.
- Committed `dist/` output for git-based installs and quick experiments.
- Optional Live Card components for game or artifact-style interfaces.

## Install

```bash
pnpm add @nexa-llc/kyaraflip-avatar-react
```

Git installs are also supported because the repository includes the built `dist/` output:

```bash
pnpm add github:NexA-LLC/kyaraflip-avatar-react
```

## Quick Start

```tsx
import { Avatar, LiveCardShooter } from '@nexa-llc/kyaraflip-avatar-react'

export function Example() {
  return (
    <>
      <div style={{ display: 'flex', gap: 16 }}>
        <Avatar name="Nexa" variant="mosaic" size={64} />
        <Avatar name="Kyara" variant="cat" size={64} />
        <Avatar name="Flip" variant="dog" size={64} square />
      </div>
      <LiveCardShooter playerName="Kyara" />
    </>
  )
}
```

## Common Patterns

### Stable user avatars

Use the same `name` value whenever the same user or entity should render the
same avatar.

```tsx
<Avatar name={user.id} title={user.displayName} variant="beam" size={48} />
```

### Custom color palette

Pass a palette when an app needs avatars to follow an existing brand or theme.

```tsx
<Avatar
  name="Kyara"
  variant="mosaic"
  colors={['#101827', '#7dd3fc', '#facc15', '#f472b6']}
/>
```

### Live Card ship

`LiveCardShip` turns a card or artifact identity into a compact spaceship-style
SVG while keeping card-like visual metadata such as rarity, element, serial, and
name.

```tsx
import { LiveCardShip } from '@nexa-llc/kyaraflip-avatar-react'

<LiveCardShip
  name="Neon Shrine"
  subtitle="World Artifact"
  imageUrl="https://example.com/card-art.png"
/>
```

## API

### `<Avatar />`

- `name: string`
- `variant?: 'mosaic' | 'orb' | 'beam' | 'cat' | 'dog'`
- `size?: number`
- `square?: boolean`
- `colors?: string[]`
- `title?: string`
- `className?: string`

`name` is the avatar seed. The same seed and variant always render the same avatar.

Available variants are exported as `AVATAR_VARIANTS`, and can be checked with
`isAvatarVariant(value)`.

### `<LiveCardShip />`

- `name: string`
- `imageUrl?: string | null`
- `subtitle?: string`
- `variant?: 'mosaic' | 'orb' | 'beam' | 'cat' | 'dog'`
- `size?: number`
- `title?: string`
- `className?: string`
- `style?: React.CSSProperties`

Turns a live-card/artifact identity into an upward-facing shooter ship while preserving visible card language: `LC` badge, card frame, rarity, element, serial, name band, foil stripe, and card artwork. Pass `imageUrl` to use the real Live Card image; without it the component renders deterministic placeholder card art instead of an avatar icon. Use `renderLiveCardShipParts(name, colors?)` when another renderer needs the same deterministic conversion data.

### `<LiveCardShooter />`

- `playerName?: string`
- `playerCard?: { name: string; subtitle?: string; imageUrl?: string | null }`
- `enemyNames?: readonly string[]`
- `enemyCards?: readonly { name: string; subtitle?: string; imageUrl?: string | null }[]`
- `width?: number`
- `height?: number`
- `className?: string`

Playable vertical shooter prototype using live-card ships. Arrow keys move, Space shoots, and `R` restarts after game over.
The game scene stays in SVG while score/life/game-over HUD is rendered as DOM, so UI can be inspected and tuned separately from the playfield renderer.

The component also exposes browser helpers for simple automated checks:

- `window.render_game_to_text()` returns a JSON summary of the current game state.
- `window.advanceTime(ms)` advances the game loop deterministically in fixed steps.

These helpers are intended for local demos and smoke tests, not as a public game
engine API.

## Exports

```ts
export {
  Avatar,
  LiveCardShip,
  LiveCardShooter,
  renderLiveCardShipParts,
  AVATAR_VARIANTS,
  isAvatarVariant,
  getPaletteIndex,
  niceColorPalettes,
  selectPalette,
}
```

The package also exports TypeScript types for avatar variants, palettes, Live
Card ship parts, and component props.

## Accessibility

- `Avatar` renders an SVG with `role="img"` when a non-empty title is available.
- Pass `title=""` only when the avatar is purely decorative and should be hidden
  from assistive technology.
- `LiveCardShip` uses an `aria-label` derived from the card name by default.
- Consumers should provide adjacent text labels when avatars are used as
  controls or list items.

## Security and Privacy

- Avatar rendering is deterministic and local; the package does not call a
  remote avatar service.
- SVG assets are bundled from this repository and do not require external asset
  hosting.
- Treat untrusted `imageUrl` values passed to `LiveCardShip` or
  `LiveCardShooter` the same way you would treat any user-provided remote image
  URL in a React app.

See [SECURITY.md](SECURITY.md) for reporting and maintenance expectations.

## Notes

- `mosaic`, `orb`, and `beam` use deterministic palette-based SVG rendering.
- `cat` and `dog` use the bundled KyaraFlip SVG parts and do not require any external asset hosting.
- The package is SSR-safe and ships both ESM and CommonJS builds.
- `dist/` is committed so git-based installs can resolve the exported entrypoints without an extra publish step.

## Development

- Codex/game-facing workflow notes live in [`docs/codex-game-development.md`](docs/codex-game-development.md).
- Release checks live in [`docs/release-checklist.md`](docs/release-checklist.md).
- Browser demo: [`examples/live-card-shooter.html`](examples/live-card-shooter.html).
- Character/game-facing changes should keep state outside renderers, use DOM HUD/control overlays, and include screenshot or browser evidence for visual review.

```bash
pnpm install
pnpm run check
pnpm run build
```

When source, exports, package metadata, or generated type declarations change,
include the updated `dist/` output in the same commit.

## Project Status

This repository is maintained as a public NexA-LLC OSS package for KyaraFlip
avatar and Live Card UI experiments. The public API is intentionally small while
the visual language is still evolving.

## Credits

- Palette data is based on `nice-color-palettes` (MIT).

## License

MIT
