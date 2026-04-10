const DEFAULT_HASH_SEED = 0x6d2b79f5

function hashString(str: string): number {
  let hash = 2166136261 >>> 0
  for (let index = 0; index < str.length; index += 1) {
    hash ^= str.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function createSeededRandom(seed: string): () => number {
  let state = hashString(seed) ^ DEFAULT_HASH_SEED

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let next = Math.imul(state ^ (state >>> 15), 1 | state)
    next ^= next + Math.imul(next ^ (next >>> 7), 61 | next)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

export function randomBetween(random: () => number, min: number, max: number): number {
  return min + random() * (max - min)
}

export function randomInt(random: () => number, minInclusive: number, maxExclusive: number): number {
  return Math.floor(randomBetween(random, minInclusive, maxExclusive))
}

export function pickItem<T>(random: () => number, items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('Cannot pick item from empty array')
  }
  const index = Math.floor(random() * items.length)
  return items[index] as T
}
