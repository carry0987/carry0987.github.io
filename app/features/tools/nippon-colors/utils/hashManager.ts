import { getHashParam, setHashParam } from '@carry0987/utils';
import { NIPPON_COLORS } from '../constants';
import type { NipponColor } from '../types';

const HASH_PARAM_KEY = 'color';

/**
 * Get color from URL hash parameter
 * @returns The found color or null if not found
 */
export function getColorFromHash(): NipponColor | null {
    if (typeof window === 'undefined') return null;

    const hash = getHashParam(HASH_PARAM_KEY)?.toLowerCase();
    if (hash) {
        const found = NIPPON_COLORS.find((c) => c.en.toLowerCase() === hash);
        if (found) return found;
    }
    return null;
}

/**
 * Set color to URL hash parameter
 * @param color The color to set
 */
export function setColorToHash(color: NipponColor): void {
    const newUrl = setHashParam(window.location.href, { [HASH_PARAM_KEY]: color.en.toLowerCase() });
    window.history.replaceState(null, '', newUrl);
}

export const hashManager = {
    getColor: getColorFromHash,
    setColor: setColorToHash
};
