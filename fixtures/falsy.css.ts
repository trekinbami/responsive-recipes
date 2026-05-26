import { createRecipe } from '../src/lib/buildtimeFn';

const recipe = createRecipe({
  defaultConditions: {
    initial: {},
    md: { '@media': '(min-width: 768px)' }
  },
  initialCondition: 'initial'
});

export const box = recipe({
  variants: {
    color: {
      red: { color: 'red' }
    }
  },
  responsiveVariants: {
    padding: {
      '0': { padding: 0 },
      '16': { padding: '16px' }
    }
  }
});
