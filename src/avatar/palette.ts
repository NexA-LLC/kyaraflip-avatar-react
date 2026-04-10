import { niceColorPalettes, type AvatarPalette } from './data/niceColorPalettes'
import { createSeededRandom } from './random'

export type { AvatarPalette } from './data/niceColorPalettes'

export function getPaletteIndex(seed: string): number {
  const random = createSeededRandom(`${seed}-palette-index`)
  return Math.floor(random() * niceColorPalettes.length)
}

export function selectPalette(seed: string, override?: string[]): string[] {
  if (override && override.length > 0) {
    return override.slice(0, 5)
  }

  const index = getPaletteIndex(seed)
  const palette = [...niceColorPalettes[index % niceColorPalettes.length]]
  const random = createSeededRandom(`${seed}-palette-order`)
  const backgroundIndex = Math.floor(random() * palette.length)
  const [background] = palette.splice(backgroundIndex, 1)

  if (background === undefined) {
    return palette
  }

  return [background, ...palette]
}

export { niceColorPalettes }
