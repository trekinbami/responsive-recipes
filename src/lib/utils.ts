import { RecipeStyleRule } from './types';

/**
 * We do not allow composition with existing classNames on variants for now
 */
export function preventComposition(styleRule?: RecipeStyleRule) {
  if (!styleRule || typeof styleRule === 'string' || Array.isArray(styleRule)) {
    throw new Error('We only allow style objects inside of variants');
  }

  return styleRule;
}

export function isStringOrNumber(obj: unknown): obj is string | number {
  return !!obj && (typeof obj === 'string' || typeof obj === 'number');
}

export function isPrimitive(value: unknown): value is string | number | boolean {
  return value !== Object(value);
}
