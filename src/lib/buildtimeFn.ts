import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import { style, styleVariants } from '@vanilla-extract/css';
import { createRuntimeFn } from './createRuntimeFn';

import type { Args, BuildResult, Conditions, VariantGroup } from './types';

function createRecipe<const D extends Conditions>(defaultConditions: {
  defaultConditions?: D;
  fallbackCondition: keyof D;
}) {
  return <const V extends VariantGroup, const RV extends VariantGroup, const C extends Conditions>(
    args: Args<V, RV, C>
  ) => {
    // Hier gaan we classNames op buildtime genereren voor alle variants
    const config = {} as BuildResult<V, RV>;

    // Default className (base)
    // Variants
    // Responsive variants
    // Compound variants

    const runtimeFn = createRuntimeFn<V, RV, D, C>(config);

    return addFunctionSerializer(runtimeFn, {
      importPath: '@alliander-fe/responsive-variants',
      importName: 'createRuntimeFn',
      args: [config],
    });
  };
}

const recipe = createRecipe({
  defaultConditions: {
    initial: { '@media': 'min-width iets' },
    sm: { '@media': 'min-width iets' },
    xl: { '@media': 'min-width iets' },
  },
  fallbackCondition: 'initial',
});

const stack = recipe({
  base: {},
  variants: {
    size: {
      small: {
        flex: '1',
      },
    },
  },
  responsiveVariants: {
    direction: {
      row: {
        flexDirection: 'row',
      },
      column: {
        flexDirection: 'column',
      },
    },
  },
  defaultVariants: {
    direction: 'column',
    size: 'small',
  },
  compoundVariants: [
    {
      variants: { direction: 'row', size: 'small' },
      style: { flex: '1' },
    },
  ],
});

const result = stack({ direction: 'row' });
