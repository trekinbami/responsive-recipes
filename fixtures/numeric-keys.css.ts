import { createRecipe } from '../src/lib/buildtimeFn';

/**
 * Fixture for variant maps declared with unquoted numeric object keys —
 * the natural shape of design-system token maps, e.g.
 *
 *   const spacings = { 0: '0px', 4: '4px', 16: '16px' } as const
 *
 * A `tsc` error on the probes below means the typed API no longer
 * accepts the documented numeric input shape.
 */
const recipe = createRecipe({
  defaultConditions: {
    initial: {},
    md: { '@media': '(min-width: 768px)' }
  },
  initialCondition: 'initial'
});

const SPACING = {
  0: { padding: 0 },
  4: { padding: '4px' },
  8: { padding: '8px' },
  16: { padding: '16px' }
};

export const numericKeyedBox = recipe({
  responsiveVariants: {
    padding: SPACING
  }
});

// Must compile — the `0` in the responsive probe pins that the JS-falsy
// numeric `0` remains a valid input.
const _flat = numericKeyedBox({ padding: 16 });
const _responsive = numericKeyedBox({ padding: { initial: 4, md: 0 } });

// Re-exported so `tsc` keeps the probes in scope.
export const _typeProbes = { _flat, _responsive };
