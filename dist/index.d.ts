import * as react_jsx_runtime from 'react/jsx-runtime';
import { CSSProperties, JSX } from 'react';

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

type LiveCardRarity = 'N' | 'R' | 'SR' | 'XR';
type LiveCardElement = 'Spark' | 'Wave' | 'Bloom' | 'Pulse';
interface LiveCardShipParts {
    hull: string;
    cockpit: string;
    trim: string;
    glow: string;
    cardBack: string;
    cardFoil: string;
    rarity: LiveCardRarity;
    element: LiveCardElement;
    serial: string;
    wingSweep: number;
    finOffset: number;
    engineCount: 2 | 3;
}
interface LiveCardShipProps {
    name: string;
    imageUrl?: string | null;
    subtitle?: string;
    variant?: AvatarVariant;
    size?: number;
    title?: string;
    className?: string;
    style?: CSSProperties;
}
declare function renderLiveCardShipParts(name: string, colors?: readonly string[]): LiveCardShipParts;
declare function LiveCardShip({ name, imageUrl, subtitle, variant: _variant, size, title, className, style, }: LiveCardShipProps): JSX.Element;

interface LiveCardAsset {
    name: string;
    subtitle?: string;
    imageUrl?: string | null;
}
interface LiveCardShooterProps {
    playerName?: string;
    playerCard?: LiveCardAsset;
    enemyNames?: readonly string[];
    enemyCards?: readonly LiveCardAsset[];
    width?: number;
    height?: number;
    className?: string;
}
declare global {
    interface Window {
        render_game_to_text?: () => string;
        advanceTime?: (ms: number) => void;
    }
}
declare function LiveCardShooter({ playerName, playerCard, enemyNames, enemyCards, width, height, className, }: LiveCardShooterProps): JSX.Element;

type AvatarPalette = readonly [string, string, string, string, string];
declare const niceColorPalettes: readonly AvatarPalette[];

declare function getPaletteIndex(seed: string): number;
declare function selectPalette(seed: string, override?: string[]): string[];

export { AVATAR_VARIANTS, Avatar, type AvatarPalette, type AvatarProps, type AvatarVariant, type LiveCardAsset, type LiveCardElement, type LiveCardRarity, LiveCardShip, type LiveCardShipParts, type LiveCardShipProps, LiveCardShooter, type LiveCardShooterProps, getPaletteIndex, isAvatarVariant, niceColorPalettes, renderLiveCardShipParts, selectPalette };
