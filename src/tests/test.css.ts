import { createRecipe } from '../lib/buildtimeFn';
import { GetVariants } from '../lib/types';

const recipe = createRecipe({
  defaultConditions: {
    // initial: { '@media': 'min-width iets' },
    sm: { '@media': 'min-width iets' },
    xl: { '@media': 'min-width iets' },
  },
  // initialCondition: 'initial',
});

const stack = recipe({
  conditions: {
    initial: { '@media': 'min-width iets' },
    mega: { '@media': 'min-width iets' },
  },
  base: {
    flex: '1',
  },
  variants: {
    size: {
      small: {
        flex: '1',
        flexDirection: 'row',
      },
      large: {},
    },
  },
  responsiveVariants: {
    direction: {
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    size: 'small',
    // direction: true,
  },
  compoundVariants: [
    {
      variants: {},
      style: { flex: '1' },
    },
  ],
});

type Variants = GetVariants<typeof stack>;
