import { useEffect, useMemo, useRef, useState, type JSX } from 'react'

import { LiveCardShip } from './LiveCardShip'
import type { AvatarVariant } from './avatar/types'

const WIDTH = 360
const HEIGHT = 560
const DEFAULT_ENEMY_CARDS = [
  { name: 'Mirror Route', subtitle: 'Scenario Artifact' },
  { name: 'Neon Shrine', subtitle: 'World Artifact' },
  { name: 'Star Courier', subtitle: 'Character Artifact' },
  { name: 'Echo Relic', subtitle: 'Item Artifact' },
] as const

export interface LiveCardAsset {
  name: string
  subtitle?: string
  imageUrl?: string | null
}

interface Point {
  x: number
  y: number
}

interface Bullet extends Point {
  id: number
}

interface Enemy extends Point {
  id: number
  card: LiveCardAsset
  variant: AvatarVariant
  hp: number
  speed: number
}

interface GameState {
  mode: 'playing' | 'gameOver'
  player: Point
  bullets: Bullet[]
  enemies: Enemy[]
  score: number
  lives: number
  cooldown: number
  spawnTimer: number
  nextId: number
}

export interface LiveCardShooterProps {
  playerName?: string
  playerCard?: LiveCardAsset
  enemyNames?: readonly string[]
  enemyCards?: readonly LiveCardAsset[]
  width?: number
  height?: number
  className?: string
}

type KeyName = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | ' ' | 'Spacebar'

declare global {
  interface Window {
    render_game_to_text?: () => string
    advanceTime?: (ms: number) => void
  }
}

function initialGameState(): GameState {
  return {
    mode: 'playing',
    player: { x: WIDTH / 2, y: HEIGHT - 78 },
    bullets: [],
    enemies: [
      { id: 1, card: DEFAULT_ENEMY_CARDS[0], variant: 'dog', x: 100, y: 82, hp: 2, speed: 26 },
      { id: 2, card: DEFAULT_ENEMY_CARDS[1], variant: 'cat', x: 246, y: 34, hp: 2, speed: 32 },
    ],
    score: 0,
    lives: 3,
    cooldown: 0,
    spawnTimer: 2.2,
    nextId: 3,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function overlaps(a: Point, ar: number, b: Point, br: number): boolean {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy <= (ar + br) * (ar + br)
}

function stepGame(
  state: GameState,
  dt: number,
  keys: ReadonlySet<KeyName>,
  enemyCards: readonly LiveCardAsset[],
): GameState {
  if (state.mode === 'gameOver') return state

  const playerSpeed = 210
  const next: GameState = {
    ...state,
    player: { ...state.player },
    bullets: state.bullets.map((bullet) => ({ ...bullet, y: bullet.y - 360 * dt })),
    enemies: state.enemies.map((enemy) => ({ ...enemy, y: enemy.y + enemy.speed * dt })),
    cooldown: Math.max(0, state.cooldown - dt),
    spawnTimer: state.spawnTimer - dt,
  }

  const xMove = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0)
  const yMove = (keys.has('ArrowDown') ? 1 : 0) - (keys.has('ArrowUp') ? 1 : 0)
  next.player.x = clamp(next.player.x + xMove * playerSpeed * dt, 42, WIDTH - 42)
  next.player.y = clamp(next.player.y + yMove * playerSpeed * dt, 120, HEIGHT - 56)

  if ((keys.has(' ') || keys.has('Spacebar')) && next.cooldown <= 0) {
    next.bullets.push({ id: next.nextId, x: next.player.x, y: next.player.y - 48 })
    next.nextId += 1
    next.cooldown = 0.18
  }

  if (next.spawnTimer <= 0) {
    const slot = next.nextId % 4
    const card = enemyCards[slot % enemyCards.length] ?? { name: `Live Card ${slot + 1}` }
    next.enemies.push({
      id: next.nextId,
      card,
      variant: slot % 2 === 0 ? 'cat' : 'dog',
      x: 54 + slot * 82,
      y: -28,
      hp: 2,
      speed: 28 + slot * 7,
    })
    next.nextId += 1
    next.spawnTimer = 2.1
  }

  const remainingBullets: Bullet[] = []
  const remainingEnemies = next.enemies.map((enemy) => ({ ...enemy }))

  for (const bullet of next.bullets) {
    if (bullet.y < -12) continue
    const hit = remainingEnemies.find((enemy) => enemy.hp > 0 && overlaps(bullet, 6, enemy, 28))
    if (hit) {
      hit.hp -= 1
      if (hit.hp <= 0) next.score += 100
    } else {
      remainingBullets.push(bullet)
    }
  }

  next.bullets = remainingBullets
  next.enemies = []
  for (const enemy of remainingEnemies) {
    if (enemy.hp <= 0) continue
    if (overlaps(enemy, 30, next.player, 32) || enemy.y > HEIGHT + 28) {
      next.lives -= 1
    } else {
      next.enemies.push(enemy)
    }
  }

  if (next.lives <= 0) {
    next.mode = 'gameOver'
    next.lives = 0
  }

  return next
}

function renderGameState(state: GameState): string {
  return JSON.stringify({
    coordinates: 'origin top-left, x right, y down',
    mode: state.mode,
    player: {
      x: Math.round(state.player.x),
      y: Math.round(state.player.y),
      cooldown: Number(state.cooldown.toFixed(2)),
    },
    bullets: state.bullets.slice(0, 6).map((bullet) => ({
      x: Math.round(bullet.x),
      y: Math.round(bullet.y),
    })),
    enemies: state.enemies.slice(0, 6).map((enemy) => ({
      name: enemy.card.name,
      subtitle: enemy.card.subtitle ?? null,
      liveCard: true,
      x: Math.round(enemy.x),
      y: Math.round(enemy.y),
      hp: enemy.hp,
    })),
    score: state.score,
    lives: state.lives,
  })
}

function LiveCardShooterHud({ state }: { state: GameState }): JSX.Element {
  return (
    <div
      aria-label="Live card shooter status"
      aria-live="polite"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        color: '#e5edf8',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          padding: '12px 16px',
          fontSize: 14,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        <span>SCORE {state.score}</span>
        <span style={{ color: '#c4b5fd', fontSize: 11, letterSpacing: 0 }}>LIVE CARD RAID</span>
        <span style={{ color: '#fecaca', textAlign: 'right' }}>LIFE {state.lives}</span>
      </div>
      {state.mode === 'gameOver' ? (
        <div
          role="status"
          style={{
            position: 'absolute',
            left: '13.333%',
            right: '13.333%',
            top: '38.9%',
            minHeight: 104,
            display: 'grid',
            placeItems: 'center',
            gap: 8,
            padding: 18,
            borderRadius: 8,
            background: 'rgba(15, 23, 42, 0.92)',
            boxSizing: 'border-box',
            textAlign: 'center',
          }}
        >
          <strong style={{ color: '#f8fafc', fontSize: 24, lineHeight: 1 }}>GAME OVER</strong>
          <span style={{ color: '#cbd5e1', fontSize: 14 }}>Press R to restart</span>
        </div>
      ) : null}
    </div>
  )
}

export function LiveCardShooter({
  playerName = 'Kyara',
  playerCard,
  enemyNames,
  enemyCards,
  width = WIDTH,
  height = HEIGHT,
  className,
}: LiveCardShooterProps): JSX.Element {
  const [state, setState] = useState<GameState>(() => initialGameState())
  const stateRef = useRef(state)
  const keysRef = useRef<Set<KeyName>>(new Set())
  const rafRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)
  const resolvedPlayerCard = useMemo<LiveCardAsset>(
    () => playerCard ?? { name: playerName, subtitle: 'Playable Artifact' },
    [playerCard, playerName],
  )
  const resolvedEnemyCards = useMemo<readonly LiveCardAsset[]>(
    () =>
      enemyCards ??
      enemyNames?.map((name, index) => ({
        name,
        subtitle: DEFAULT_ENEMY_CARDS[index % DEFAULT_ENEMY_CARDS.length]?.subtitle ?? 'Artifact',
      })) ??
      DEFAULT_ENEMY_CARDS,
    [enemyCards, enemyNames],
  )
  const stars = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        x: (index * 83) % WIDTH,
        y: (index * 137) % HEIGHT,
        r: 0.7 + (index % 3) * 0.45,
        opacity: 0.24 + (index % 5) * 0.12,
      })),
    [],
  )

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    const sync = (next: GameState) => {
      stateRef.current = next
      setState(next)
    }

    const advance = (ms: number) => {
      const steps = Math.max(1, Math.round(ms / (1000 / 60)))
      let next = stateRef.current
      for (let i = 0; i < steps; i += 1) {
        next = stepGame(next, 1 / 60, keysRef.current, resolvedEnemyCards)
      }
      sync(next)
    }

    const tick = (time: number) => {
      const lastTime = lastTimeRef.current ?? time
      const dt = Math.min(0.05, (time - lastTime) / 1000)
      lastTimeRef.current = time
      sync(stepGame(stateRef.current, dt, keysRef.current, resolvedEnemyCards))
      rafRef.current = window.requestAnimationFrame(tick)
    }

    const keydown = (event: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Spacebar'].includes(event.key)) {
        keysRef.current.add(event.key as KeyName)
        event.preventDefault()
      }
      if (event.key.toLowerCase() === 'r') {
        sync(initialGameState())
      }
    }
    const keyup = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key as KeyName)
    }

    const renderText = () => renderGameState(stateRef.current)
    window.render_game_to_text = renderText
    window.advanceTime = advance
    window.addEventListener('keydown', keydown)
    window.addEventListener('keyup', keyup)
    rafRef.current = window.requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current)
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('keyup', keyup)
      if (window.render_game_to_text === renderText) window.render_game_to_text = undefined
      if (window.advanceTime === advance) window.advanceTime = undefined
    }
  }, [resolvedEnemyCards])

  return (
    <div
      className={className}
      style={{
        width,
        fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        color: '#e5edf8',
        userSelect: 'none',
      }}
    >
      <div style={{ position: 'relative', width, height }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label="KyaraFlip live card shooter playfield"
          style={{ display: 'block', borderRadius: 8, background: '#101827' }}
        >
          <rect width={WIDTH} height={HEIGHT} fill="#101827" />
          <path d="M0 0 H360 V560 H0 Z" fill="#142036" />
          {stars.map((star) => (
            <circle
              key={`${star.x}-${star.y}`}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill="#f8fbff"
              opacity={star.opacity}
            />
          ))}
          {state.bullets.map((bullet) => (
            <g key={bullet.id}>
              <rect x={bullet.x - 3} y={bullet.y - 16} width="6" height="20" rx="3" fill="#7dd3fc" />
              <circle cx={bullet.x} cy={bullet.y - 18} r="5" fill="#e0f2fe" opacity="0.85" />
            </g>
          ))}
          {state.enemies.map((enemy) => (
            <g key={enemy.id} transform={`translate(${enemy.x - 34} ${enemy.y - 40}) scale(0.7)`}>
              <LiveCardShip
                name={enemy.card.name}
                imageUrl={enemy.card.imageUrl}
                subtitle={enemy.card.subtitle}
                variant={enemy.variant}
                size={96}
              />
            </g>
          ))}
          <g transform={`translate(${state.player.x - 48} ${state.player.y - 56})`}>
            <LiveCardShip
              name={resolvedPlayerCard.name}
              imageUrl={resolvedPlayerCard.imageUrl}
              subtitle={resolvedPlayerCard.subtitle}
              variant="cat"
              size={96}
            />
          </g>
        </svg>
        <LiveCardShooterHud state={state} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 8, fontSize: 12 }}>
        <span>Move: Arrow keys</span>
        <span>Shoot: Space</span>
        <span>Restart: R</span>
      </div>
    </div>
  )
}
