import { createRecipe } from '../src/lib/buildtimeFn';

const recipe = createRecipe({
  defaultConditions: {
    sm: { '@media': '(min-width: 375px)' },
    xl: { '@media': '(min-with: 1280px)' },
  },
  initialCondition: 'sm',
});

export const stack = recipe({
  conditions: {
    initial: { '@media': '(min-width: 0px)' },
    md: { '@media': '(min-width: 768px)' },
    lg: { '@media': '(min-width: 1024px)' },
  },
  initialCondition: 'initial',
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
  compoundVariants: [
    {
      variants: {
        isDesktop: true,
        spacing: 'compact',
      },
      style: {
        padding: '20px',
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
    {
      variants: {
        size: 'small',
        spacing: 'compact',
      },
      style: {
        flexBasis: 123,
      },
    },
    {
      variants: {
        isDesktop: false,
        spacing: 'compact',
      },
      style: {
        padding: '100px',
      },
    },
    {
      variants: {
        spacing: 'normal',
        amountOfCols: 12,
      },
      style: { width: '1111px' },
    },
    {
      variants: {
        direction: 'row',
        backgroundColor: 'green',
      },
      style: { display: 'block' },
    },
    {
      variants: {
        isFullHeight: false,
        size: 'small',
      },
      style: {
        display: 'grid',
      },
    },
    {
      variants: {
        gap: 1,
        spacing: 'normal',
      },
      style: {
        gridTemplateColumns: 'repeat(12, 1fr)',
      },
    },
  ],
});

export const heading = recipe({
  base: {
    fontFamily: 'fantasy',
  },
  responsiveVariants: {
    size: {
      small: { fontSize: '12px' },
      large: { fontSize: '24px' },
    },
  },
  variants: {
    color: {
      red: { color: 'red' },
      blue: { color: 'blue' },
    },
  },
  defaultVariants: {
    size: 'large',
    color: 'red',
  },
});
