import * as react_jsx_runtime from 'react/jsx-runtime';

declare const AVATAR_VARIANTS: readonly ["mosaic", "orb", "beam", "cat", "dog"];
type AvatarVariant = (typeof AVATAR_VARIANTS)[number];
declare function isAvatarVariant(value: string): value is AvatarVariant;

interface AvatarProps {
    name: string;
    variant?: AvatarVariant;
    size?: number;
    square?: boolean;
    colors?: string[];
    title?: string;
    className?: string;
}
declare function Avatar({ name, variant, size, square, colors, title, className, }: AvatarProps): react_jsx_runtime.JSX.Element;

type AvatarPalette = readonly [string, string, string, string, string];
declare const niceColorPalettes: readonly AvatarPalette[];

declare function getPaletteIndex(seed: string): number;
declare function selectPalette(seed: string, override?: string[]): string[];

export { AVATAR_VARIANTS, Avatar, type AvatarPalette, type AvatarProps, type AvatarVariant, getPaletteIndex, isAvatarVariant, niceColorPalettes, selectPalette };
