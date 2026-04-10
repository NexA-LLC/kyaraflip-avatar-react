import type { JSX } from 'react'

import {
  catNeko_earAssets,
  catNeko_emotionAssets,
  catNeko_faceAssets,
  catNeko_higeAssets,
  dogInu_earAssets,
  dogInu_emotionAssets,
  dogInu_faceAssets,
} from './assets'
import { createSeededRandom, pickItem, randomBetween, randomInt } from './random'

export interface AvatarRendererOptions {
  seed: string
  colors: readonly string[]
}

export type AvatarRenderer = (options: AvatarRendererOptions) => JSX.Element

const VIEWBOX_SIZE = 80

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function renderSvgLayer(href: string, key: string): JSX.Element {
  return (
    <image
      key={key}
      xlinkHref={href}
      href={href}
      x={0}
      y={0}
      width={VIEWBOX_SIZE}
      height={VIEWBOX_SIZE}
      preserveAspectRatio="xMidYMid meet"
    />
  )
}

export const renderMosaicAvatar: AvatarRenderer = ({ seed, colors }) => {
  const random = createSeededRandom(`${seed}-mosaic`)
  const cells = 2
  const cellSize = VIEWBOX_SIZE / cells
  const shapes: JSX.Element[] = []

  for (let y = 0; y < cells; y += 1) {
    for (let x = 0; x < cells; x += 1) {
      const cx = x * cellSize + cellSize / 2
      const cy = y * cellSize + cellSize / 2
      const color = pickItem(random, colors)
      const shapeType = randomInt(random, 0, 3)
      const rotation = randomBetween(random, -35, 35)

      if (shapeType === 0) {
        const radius = randomBetween(random, cellSize * 0.35, cellSize * 0.55)
        shapes.push(
          <circle
            key={`mosaic-circle-${x}-${y}`}
            cx={cx}
            cy={cy}
            r={radius}
            fill={color}
            opacity={randomBetween(random, 0.75, 1)}
          />,
        )
      } else if (shapeType === 1) {
        const width = randomBetween(random, cellSize * 0.7, cellSize * 1.1)
        const height = randomBetween(random, cellSize * 0.4, cellSize * 0.9)
        shapes.push(
          <rect
            key={`mosaic-rect-${x}-${y}`}
            x={cx - width / 2}
            y={cy - height / 2}
            width={width}
            height={height}
            fill={color}
            opacity={randomBetween(random, 0.7, 0.95)}
            rx={cellSize * 0.18}
            ry={cellSize * 0.18}
            transform={`rotate(${rotation} ${cx} ${cy})`}
          />,
        )
      } else {
        const points = 5
        const radiusOuter = randomBetween(random, cellSize * 0.45, cellSize * 0.6)
        const radiusInner = radiusOuter * randomBetween(random, 0.35, 0.55)
        const startAngle = randomBetween(random, 0, Math.PI * 2)
        const polygonPoints: string[] = []

        for (let i = 0; i < points * 2; i += 1) {
          const angle = startAngle + (i * Math.PI) / points
          const radius = i % 2 === 0 ? radiusOuter : radiusInner
          const px = cx + Math.cos(angle) * radius
          const py = cy + Math.sin(angle) * radius
          polygonPoints.push(`${px},${py}`)
        }

        shapes.push(
          <polygon
            key={`mosaic-polygon-${x}-${y}`}
            points={polygonPoints.join(' ')}
            fill={color}
            opacity={randomBetween(random, 0.65, 0.9)}
          />,
        )
      }
    }
  }

  return <g>{shapes}</g>
}

export const renderOrbAvatar: AvatarRenderer = ({ seed, colors }) => {
  const random = createSeededRandom(`${seed}-orb`)
  const circles: JSX.Element[] = []
  const circleCount = randomInt(random, 4, 7)

  for (let i = 0; i < circleCount; i += 1) {
    const radius = randomBetween(random, 18, 42)
    const cx = randomBetween(random, radius, VIEWBOX_SIZE - radius)
    const cy = randomBetween(random, radius, VIEWBOX_SIZE - radius)
    const color = colors[i % colors.length]!
    const opacity = randomBetween(random, 0.45, 0.85)

    circles.push(
      <circle key={`orb-${i}`} cx={cx} cy={cy} r={radius} fill={color} opacity={opacity} />,
    )
  }

  const haloColor = pickItem(random, colors)
  circles.push(
    <circle
      key="orb-halo"
      cx={VIEWBOX_SIZE / 2}
      cy={VIEWBOX_SIZE / 2}
      r={randomBetween(random, 12, 18)}
      fill={haloColor}
      opacity={0.9}
    />,
  )

  return <g>{circles}</g>
}

export const renderBeamAvatar: AvatarRenderer = ({ seed, colors }) => {
  const random = createSeededRandom(`${seed}-beam`)
  const beams: JSX.Element[] = []
  const centre = VIEWBOX_SIZE / 2
  const beamCount = randomInt(random, 6, 11)

  for (let i = 0; i < beamCount; i += 1) {
    const angle = randomBetween(random, 0, 360)
    const width = randomBetween(random, 8, 18)
    const length = randomBetween(random, VIEWBOX_SIZE * 0.8, VIEWBOX_SIZE * 1.15)
    const color = colors[i % colors.length]!

    beams.push(
      <rect
        key={`beam-${i}`}
        x={centre - width / 2}
        y={centre - length * 0.05}
        width={width}
        height={length}
        fill={color}
        opacity={randomBetween(random, 0.55, 0.85)}
        transform={`rotate(${angle} ${centre} ${centre})`}
      />,
    )
  }

  const coreRadius = randomBetween(random, 16, 22)
  const core = pickItem(random, colors)
  const inner = pickItem(random, colors)

  return (
    <g>
      {beams}
      <circle cx={centre} cy={centre} r={coreRadius} fill={core} opacity={0.95} />
      <circle cx={centre} cy={centre} r={coreRadius * 0.5} fill={inner} opacity={0.9} />
    </g>
  )
}

export const renderCatAvatar: AvatarRenderer = ({ seed }) => {
  const random = createSeededRandom(`${seed}-cat`)
  const ear = svgToDataUri(pickItem(random, catNeko_earAssets))
  const face = svgToDataUri(pickItem(random, catNeko_faceAssets))
  const emotion = svgToDataUri(pickItem(random, catNeko_emotionAssets))
  const whiskers = random() < 0.9 ? svgToDataUri(pickItem(random, catNeko_higeAssets)) : null

  return (
    <g>
      {renderSvgLayer(ear, 'cat-ear')}
      {renderSvgLayer(face, 'cat-face')}
      {whiskers ? renderSvgLayer(whiskers, 'cat-whiskers') : null}
      {renderSvgLayer(emotion, 'cat-emotion')}
    </g>
  )
}

export const renderDogAvatar: AvatarRenderer = ({ seed }) => {
  const random = createSeededRandom(`${seed}-dog`)
  const ear = svgToDataUri(pickItem(random, dogInu_earAssets))
  const face = svgToDataUri(pickItem(random, dogInu_faceAssets))
  const emotion = svgToDataUri(pickItem(random, dogInu_emotionAssets))

  return (
    <g>
      {renderSvgLayer(ear, 'dog-ear')}
      {renderSvgLayer(face, 'dog-face')}
      {renderSvgLayer(emotion, 'dog-emotion')}
    </g>
  )
}
