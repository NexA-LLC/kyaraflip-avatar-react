# `@nexa-llc/kyaraflip-avatar-react`

KyaraFlip avatar components for React.

This package exposes the geometric avatar variants used in KyaraFlip plus the cute animal variants backed by the original cat and dog SVG parts.

## Install

```bash
pnpm add @nexa-llc/kyaraflip-avatar-react
```

Git installs are also supported because the repository includes the built `dist/` output:

```bash
pnpm add github:NexA-LLC/kyaraflip-avatar-react
```

## Usage

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

### `<LiveCardShip />`

- `name: string`
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

## Notes

- `mosaic`, `orb`, and `beam` use deterministic palette-based SVG rendering.
- `cat` and `dog` use the bundled KyaraFlip SVG parts and do not require any external asset hosting.
- The package is SSR-safe and ships both ESM and CommonJS builds.
- `dist/` is committed so git-based installs can resolve the exported entrypoints without an extra publish step.

## Development

- Codex/game-facing workflow notes live in [`docs/codex-game-development.md`](docs/codex-game-development.md).
- Browser demo: [`examples/live-card-shooter.html`](examples/live-card-shooter.html).

## Credits

- Palette data is based on `nice-color-palettes` (MIT).

## License

MIT
