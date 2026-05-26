import { createRecipe } from '../src/lib/buildtimeFn';

/**
 * Fixture for variant maps whose key set mixes plain strings and
 * numeric-string keys, e.g. a CSS-grid column variant:
 *
 *   const GRID_COLUMN = {
 *     'content-start': { gridColumn: 'content-start' },
 *     'content-end':   { gridColumn: 'content-end' },
 *     3: { gridColumn: 3 },
 *     6: { gridColumn: 6 },
 *     12: { gridColumn: 12 }
 *   } as const
 *
 * The probes below pin that `ValueMap` distributes over the key union,
 * yielding `'content-start' | 'content-end' | 3 | 6 | 12` at the call site
 * (each key in its own canonical form).
 */
const recipe = createRecipe({
  defaultConditions: {
    initial: {},
    md: { '@media': '(min-width: 768px)' }
  },
  initialCondition: 'initial'
});

const GRID_COLUMN = {
  'content-start': { gridColumn: 'content-start' },
  'content-end': { gridColumn: 'content-end' },
  3: { gridColumn: 3 },
  6: { gridColumn: 6 },
  12: { gridColumn: 12 }
};

export const mixedKeyedGrid = recipe({
  responsiveVariants: {
    gridColumn: GRID_COLUMN
  }
});

// Must compile — each branch of the distribution exercised:
//   - string-keyed input
//   - numeric-keyed input
//   - responsive object mixing both forms
const _flatString = mixedKeyedGrid({ gridColumn: 'content-start' });
const _flatNumber = mixedKeyedGrid({ gridColumn: 6 });
const _responsiveMixed = mixedKeyedGrid({
  gridColumn: { initial: 'content-start', md: 6 }
});

// Re-exported so `tsc` keeps the probes in scope.
export const _typeProbes = { _flatString, _flatNumber, _responsiveMixed };
