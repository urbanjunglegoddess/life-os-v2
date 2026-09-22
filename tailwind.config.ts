/**
 * The NativeWind theme — Root System 4.7 §11.
 *
 * This file defines no design values. It maps the token module into Tailwind
 * theme keys so components can write `bg-surface` or `rounded-lg` and get the
 * token, not Tailwind's stock scale. Changing a value means editing
 * `src/tokens`, never this file.
 *
 * Naming: each semantic colour is exposed under the utility it belongs to, with
 * the role prefix stripped, so the class reads once — `bg-surface`,
 * `text-muted`, `border-meaningful` — rather than `bg-bg-surface`. Roles that
 * are not tied to one utility (accent, state, focus) go in `colors` and work
 * everywhere: `bg-accent-primary`, `text-state-error`, `border-focus-ring`.
 */
import type { Config } from 'tailwindcss';

import {
  BORDER_WIDTH,
  COLOR,
  FONT_SIZE,
  FONT_WEIGHT,
  LETTER_SPACING,
  LINE_HEIGHT,
  RADIUS,
  SPACE,
} from './src/tokens/src/index.ts';

/** `{ 'space-4': 16 }` → `{ '4': '16px' }` for every key carrying `prefix`. */
function scale(
  tokens: Record<string, number | string>,
  prefix: string,
  unit = 'px',
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tokens).map(([name, value]) => [
      name.slice(prefix.length),
      typeof value === 'number' ? `${value}${unit}` : value,
    ]),
  );
}

/** Semantic colours whose name starts with `prefix`, with the prefix removed. */
function colorsFor(prefix: string): Record<string, string> {
  return Object.fromEntries(
    Object.entries(COLOR)
      .filter(([name]) => name.startsWith(prefix))
      .map(([name, value]) => [name.slice(prefix.length), value]),
  );
}

/** The roles that are not owned by a single utility. */
const sharedColors = Object.fromEntries(
  Object.entries(COLOR).filter(
    ([name]) => !/^(bg|text|border)-/.test(name),
  ),
);

export default {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: sharedColors,
      backgroundColor: colorsFor('bg-'),
      textColor: colorsFor('text-'),
      borderColor: colorsFor('border-'),

      spacing: scale(SPACE, 'space-'),
      borderRadius: scale(RADIUS, 'radius-'),
      borderWidth: scale(BORDER_WIDTH, 'border-width-'),

      fontSize: scale(FONT_SIZE, 'font-size-'),
      fontWeight: scale(FONT_WEIGHT, 'font-weight-'),
      // Unitless: NativeWind resolves these as a multiple of the font size.
      lineHeight: scale(LINE_HEIGHT, 'line-height-', ''),
      letterSpacing: scale(LETTER_SPACING, 'letter-spacing-'),
    },
  },
  plugins: [],
} satisfies Config;
