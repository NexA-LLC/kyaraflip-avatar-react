import {
  renderBeamAvatar,
  renderCatAvatar,
  renderDogAvatar,
  renderMosaicAvatar,
  renderOrbAvatar,
  type AvatarRenderer,
} from './avatar/renderers'
import { selectPalette } from './avatar/palette'
import { createSeededRandom } from './avatar/random'
import { type AvatarVariant } from './avatar/types'

export type { AvatarVariant } from './avatar/types'

export interface AvatarProps {
  name: string
  variant?: AvatarVariant
  size?: number
  square?: boolean
  colors?: string[]
  title?: string
  className?: string
}

const VIEWBOX_SIZE = 80

const RENDERERS: Record<AvatarVariant, AvatarRenderer> = {
  mosaic: renderMosaicAvatar,
  orb: renderOrbAvatar,
  beam: renderBeamAvatar,
  cat: renderCatAvatar,
  dog: renderDogAvatar,
}

function getMaskId(seed: string, variant: AvatarVariant): string {
  const random = createSeededRandom(`${seed}-${variant}-mask`)
  const id = Math.floor(random() * Number.MAX_SAFE_INTEGER).toString(36)
  return `kyaraflip-avatar-mask-${id}`
}

export function Avatar({
  name,
  variant = 'mosaic',
  size = 64,
  square = false,
  colors,
  title,
  className,
}: AvatarProps) {
  const palette = selectPalette(name, colors)
  const background = palette[0] ?? '#111827'
  const accentColors = palette.slice(1)
  const renderer = RENDERERS[variant] ?? renderMosaicAvatar
  const maskId = getMaskId(name, variant)
  const content = renderer({
    seed: name,
    colors: accentColors.length > 0 ? accentColors : [background],
  })
  const labelledTitle = title ?? name
  const hasAccessibleTitle = labelledTitle.trim().length > 0

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      role="img"
      aria-hidden={hasAccessibleTitle ? undefined : true}
      className={className}
      focusable="false"
    >
      {hasAccessibleTitle ? <title>{labelledTitle}</title> : null}
      {square ? (
        <g>
          <rect width={VIEWBOX_SIZE} height={VIEWBOX_SIZE} fill={background} />
          {content}
        </g>
      ) : (
        <>
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse">
              <rect
                width={VIEWBOX_SIZE}
                height={VIEWBOX_SIZE}
                fill="#fff"
                rx={VIEWBOX_SIZE / 2}
                ry={VIEWBOX_SIZE / 2}
              />
            </mask>
          </defs>
          <g mask={`url(#${maskId})`}>
            <rect width={VIEWBOX_SIZE} height={VIEWBOX_SIZE} fill={background} />
            {content}
          </g>
        </>
      )}
    </svg>
  )
}
