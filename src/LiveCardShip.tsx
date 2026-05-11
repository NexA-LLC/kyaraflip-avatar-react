import type { CSSProperties, JSX } from 'react'

import { selectPalette } from './avatar/palette'
import { createSeededRandom, randomBetween } from './avatar/random'
import type { AvatarVariant } from './avatar/types'

export type LiveCardRarity = 'N' | 'R' | 'SR' | 'XR'
export type LiveCardElement = 'Spark' | 'Wave' | 'Bloom' | 'Pulse'

export interface LiveCardShipParts {
  hull: string
  cockpit: string
  trim: string
  glow: string
  cardBack: string
  cardFoil: string
  rarity: LiveCardRarity
  element: LiveCardElement
  serial: string
  wingSweep: number
  finOffset: number
  engineCount: 2 | 3
}

export interface LiveCardShipProps {
  name: string
  imageUrl?: string | null
  subtitle?: string
  variant?: AvatarVariant
  size?: number
  title?: string
  className?: string
  style?: CSSProperties
}

const RARITIES: readonly LiveCardRarity[] = ['N', 'R', 'SR', 'XR']
const ELEMENTS: readonly LiveCardElement[] = ['Spark', 'Wave', 'Bloom', 'Pulse']

function compactLabel(name: string): string {
  const normalized = name.trim()
  if (normalized.length <= 12) return normalized
  return `${normalized.slice(0, 10)}..`
}

function renderFallbackArtwork(name: string, parts: LiveCardShipParts): JSX.Element {
  const random = createSeededRandom(`${name}-live-card-artwork`)
  const orbX = randomBetween(random, 34, 62)
  const orbY = randomBetween(random, 39, 56)
  const pathOffset = randomBetween(random, -8, 8)

  return (
    <g>
      <rect x="26" y="34" width="44" height="30" rx="5" fill={parts.hull} opacity="0.24" />
      <path
        d={`M29 58 C38 ${44 + pathOffset} 45 ${62 - pathOffset} 68 43`}
        fill="none"
        stroke={parts.cardFoil}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.82"
      />
      <circle cx={orbX} cy={orbY} r="9" fill={parts.glow} opacity="0.92" />
      <path d="M48 38 L58 58 H38 Z" fill={parts.cockpit} stroke="#0f172a" strokeWidth="1.5" opacity="0.92" />
      <path d="M33 61 H63" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <circle cx="36" cy="40" r="2" fill="#f8fafc" opacity="0.86" />
      <circle cx="62" cy="58" r="1.8" fill="#f8fafc" opacity="0.72" />
    </g>
  )
}

export function renderLiveCardShipParts(name: string, colors?: readonly string[]): LiveCardShipParts {
  const palette = selectPalette(name, colors ? [...colors] : undefined)
  const random = createSeededRandom(`${name}-live-card-ship`)
  const rarityIndex = Math.min(RARITIES.length - 1, Math.floor(random() * RARITIES.length))
  const elementIndex = Math.min(ELEMENTS.length - 1, Math.floor(random() * ELEMENTS.length))

  return {
    hull: palette[0] ?? '#16324f',
    cockpit: palette[1] ?? '#f5f7fb',
    trim: palette[2] ?? '#62d2ff',
    glow: palette[3] ?? '#ffcf5a',
    cardBack: palette[4] ?? '#f8fafc',
    cardFoil: palette[5] ?? '#a78bfa',
    rarity: RARITIES[rarityIndex]!,
    element: ELEMENTS[elementIndex]!,
    serial: Math.floor(random() * 0xfffff).toString(16).padStart(5, '0').toUpperCase(),
    wingSweep: randomBetween(random, 4, 10),
    finOffset: randomBetween(random, 1.5, 5.5),
    engineCount: random() > 0.58 ? 3 : 2,
  }
}

export function LiveCardShip({
  name,
  imageUrl,
  subtitle,
  variant: _variant,
  size = 80,
  title,
  className,
  style,
}: LiveCardShipProps): JSX.Element {
  const parts = renderLiveCardShipParts(name)
  const labelledTitle = title ?? `${name} ship`
  const cardLabel = compactLabel(name)
  const cardSubtitle = compactLabel(subtitle ?? parts.element)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 112"
      role="img"
      aria-label={labelledTitle}
      className={className}
      style={style}
      focusable="false"
    >
      <rect
        x="17"
        y="18"
        width="62"
        height="70"
        rx="8"
        fill={parts.cardBack}
        stroke="#f8fafc"
        strokeWidth="2"
        opacity="0.96"
      />
      <path d="M22 27 H74" stroke={parts.cardFoil} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M22 78 H74" stroke={parts.cardFoil} strokeWidth="2" strokeLinecap="round" opacity="0.72" />
      <rect x="21" y="22" width="26" height="10" rx="3" fill="#0f172a" opacity="0.86" />
      <text x="25" y="30" fill="#f8fafc" fontSize="7" fontWeight="800">
        LC
      </text>
      <text x="55" y="31" fill="#0f172a" fontSize="8" fontWeight="900">
        {parts.rarity}
      </text>
      <circle cx="69" cy="28" r="5" fill={parts.glow} stroke="#0f172a" strokeWidth="1.3" />
      <path
        d={`M48 5 L69 ${66 + parts.wingSweep} L59 99 L48 91 L37 99 L27 ${66 + parts.wingSweep} Z`}
        fill={parts.hull}
        stroke="#0f172a"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d={`M30 ${58 + parts.finOffset} L6 82 L34 88 Z`}
        fill={parts.trim}
        stroke="#0f172a"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d={`M66 ${58 + parts.finOffset} L90 82 L62 88 Z`}
        fill={parts.trim}
        stroke="#0f172a"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M48 13 C58 28 62 46 57 62 C54 72 42 72 39 62 C34 46 38 28 48 13 Z"
        fill={parts.cockpit}
        opacity="0.94"
        stroke="#0f172a"
        strokeWidth="2"
      />
      {imageUrl ? (
        <image
          href={imageUrl}
          x="25"
          y="33"
          width="46"
          height="32"
          preserveAspectRatio="xMidYMid slice"
          style={{ clipPath: 'inset(0 round 5px)' }}
        />
      ) : (
        renderFallbackArtwork(name, parts)
      )}
      <rect x="25" y="67" width="46" height="11" rx="3" fill="#0f172a" opacity="0.88" />
      <text x="48" y="75" fill="#f8fafc" fontSize="7" fontWeight="800" textAnchor="middle">
        {cardLabel}
      </text>
      <text x="48" y="83" fill="#0f172a" fontSize="5.5" fontWeight="900" textAnchor="middle">
        {cardSubtitle}
      </text>
      <text x="48" y="86" fill="#0f172a" fontSize="6.5" fontWeight="800" textAnchor="middle">
        #{parts.serial}
      </text>
      <rect x="41" y="81" width="14" height="18" rx="5" fill="#0f172a" opacity="0.8" />
      {parts.engineCount === 3 ? (
        <circle cx="48" cy="101" r="5" fill={parts.glow} opacity="0.9" />
      ) : null}
      <circle cx="38" cy="99" r="5" fill={parts.glow} />
      <circle cx="58" cy="99" r="5" fill={parts.glow} />
    </svg>
  )
}
