import { createRecipe } from '../src/lib/buildtimeFn';

const recipe = createRecipe({
  defaultConditions: {
    sm: { '@media': '(min-width: 375px)' },
    xl: { '@media': '(min-with: 1280px)' },
  },
  initialCondition: 'sm',
});

// If you make changes, the bundled classNames will change and the tests will fail
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
    spacing: {
      compact: {},
      normal: {},
    },
    isDesktop: {
      true: {},
      false: {},
    },
    amountOfCols: {
      0: {},
      12: {},
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
      row: {
        flexDirection: 'row',
      },
      column: {
        flexDirection: 'column',
      },
    },
    isFullHeight: {
      true: {},
      false: {},
    },
  },
  defaultVariants: {
    size: 'small',
    backgroundColor: 'green',
  },
  compoundVariants: [
    {
      variants: {
        isDesktop: false,
        spacing: 'compact',
      },
      style: {
        flexBasis: '100px',
      },
    },
    {
      variants: {
        spacing: 'normal',
        amountOfCols: 0,
      },
      style: {
        flexBasis: 100,
      },
    },
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
