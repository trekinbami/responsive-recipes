import { createRecipe } from '../src/lib/buildtimeFn';

const recipe = createRecipe({
  defaultConditions: {
    sm: { '@media': 'min-width iets' },
    xl: { '@media': 'min-width iets' },
  },
  initialCondition: 'sm',
});

export const stack = recipe({
  conditions: {
    initial: { '@media': '(min-width: 0px)' },
    md: { '@media': '(min-width: 768px)' },
    lg: { '@media': '(min-width: 1024px)' },
  },
  base: {
    flex: '1',
    display: 'flex',
  },
  variants: {
    size: {
      small: {
        width: '100px',
        height: '100px',
      },
      large: {
        width: '400px',
        height: '400px',
      },
    },
  },
  responsiveVariants: {
    backgroundColor: {
      green: { backgroundColor: 'green' },
      blue: { backgroundColor: 'blue' },
      red: { backgroundColor: 'red' },
    },
    gap: {
      1: { gap: '4px' },
      2: { gap: '8px' },
      3: { gap: '12px' },
    },
    direction: {
      true: {
        flexDirection: 'row',
      },
      false: {
        flexDirection: 'revert',
      },
    },
  },
  defaultVariants: {
    // size: 'large',
    backgroundColor: 'green',
  },
  compoundVariants: [
    {
      variants: {
        size: 'small',
        backgroundColor: 'blue',
      },
      style: { border: '20px solid yellow' },
    },
    {
      variants: {
        size: 'small',
        backgroundColor: 'red',
      },
      style: {
        border: 0,
      },
    },
  ],
});
