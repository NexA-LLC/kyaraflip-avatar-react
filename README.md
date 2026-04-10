# `@nexa-llc/kyaraflip-avatar-react`

KyaraFlip avatar components for React.

This package exposes the geometric avatar variants used in KyaraFlip plus the cute animal variants backed by the original cat and dog SVG parts.

## Install

```bash
pnpm add @nexa-llc/kyaraflip-avatar-react
```

## Usage

```tsx
import { Avatar } from '@nexa-llc/kyaraflip-avatar-react'

export function Example() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar name="Nexa" variant="mosaic" size={64} />
      <Avatar name="Kyara" variant="cat" size={64} />
      <Avatar name="Flip" variant="dog" size={64} square />
    </div>
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

## Notes

- `mosaic`, `orb`, and `beam` use deterministic palette-based SVG rendering.
- `cat` and `dog` use the bundled KyaraFlip SVG parts and do not require any external asset hosting.
- The package is SSR-safe and ships both ESM and CommonJS builds.

## Credits

- Palette data is based on `nice-color-palettes` (MIT).

## License

MIT
