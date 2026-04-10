export const AVATAR_VARIANTS = ['mosaic', 'orb', 'beam', 'cat', 'dog'] as const

export type AvatarVariant = (typeof AVATAR_VARIANTS)[number]

export function isAvatarVariant(value: string): value is AvatarVariant {
  return (AVATAR_VARIANTS as readonly string[]).includes(value)
}
