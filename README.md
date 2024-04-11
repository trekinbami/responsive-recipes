# Responsive recipes

Responsive recipes is an enriched version of [recipes](https://vanilla-extract.style/documentation/packages/recipes/) by Vanilla Extract. Responsive recipes, like the name already tells, can also generate responsive variants and aims to have a great Typescript experience.

## Installation

Since it's a plugin for Vanilla Extract, it needs `@vanilla-extract/css` as well.

```
npm i responsive-recipes @vanilla-extract/css
```

## Getting started

We need to create some default conditions for our responsive variants. We also need an `initialCondition` as a fallback.

```ts
import { createRecipe } from 'responsive-recipes';

const recipe = createRecipe({
  defaultConditions: {
    initial: {},
    sm: '(min-width: 380px)',
    lg: '(min-width: 1024px)',
  },
  initialCondition: 'initial',
});
```

We can use this `recipe` function to generate a piece of statically extracted CSS, powered by Vanilla Extract. Like regular recipes it can take an optional set of `base` styles, `variants`, `compoundVariants`, `defaultVariants`.

But `responsive-recipes` also takes in `responsiveVariants`.

```ts
const stack = recipe({
  base: {
    display: 'flex',
  },
  variants: {
    isFullHeight: {
      true: {
        height: '100%',
      },
      false: {
        height: 'auto',
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
  compoundVariants: {
    variants: {
      direction: 'row',
      isFullHeight: true,
    },
    style: {
      backgroundColor: 'green',
    },
  },
  defaultVariants: {
    isFullHeight: false,
    direction: 'row',
  },
});
```

## Runtime

In runtime, you can use this function to generate classNames

```ts
const className = stack({
  isFullHeight: true,
  direction: { initial: 'column', lg: 'row' },
});
```

## Responsive variants

Responsive variants get generated for each set condition in your configuration.

### The initialCondition is used as a fallback for responsive variants

Whenever you call a responsive variant with a string it will select the style rule defined in the initialCondition.

```ts
const className = stack({ direction: 'row' });
// Is equal to stack({ direction: { initial: 'row' }});
```

## Custom conditions

If you need to override the `defaultConditions` set in `createRecipe`, you can add a `conditions` property with an `initialCondition` to your recipe. Responsive variants in this recipe will only be generated for these `conditions`.

```ts
const stack = recipe({
  conditions: {
    initial: {},
    md: '(min-width: 768px)',
    xl: '(min-width: 1280px)',
  },
  initialCondition: 'initial',
  base: {
    display: 'flex',
  },
  variants: {
    isFullHeight: {
      true: {
        height: '100%',
      },
      false: {
        height: 'auto',
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
  compoundVariants: {
    variants: {
      direction: 'row',
      isFullHeight: true,
    },
    style: {
      backgroundColor: 'green',
    },
  },
  defaultVariants: {
    isFullHeight: false,
    direction: 'row',
  },
});
```

### ❗️ Recommended: only use min-widths for now ❗️

Only `min-width` media queries have been battle tested in production, so we recommend to only use those for now.

## Compound variants

A compound variant is a variant that kicks in when a combination of variants and or responsive variants are active. These account for (min-width) conditions as well.

```ts
const className = stack({
  isFullHeight: true,
  direction: { initial: 'column', lg: 'row' },
});
```

`isFullHeight` is a regular variant. Regular variants are valid for all conditions. That means that the compoundVariant combination will kick in from the `lg` breakpoint.

## Default variants

Variants will fall back to the default variants if they're not defined in the runtime.

## Type helpers

`GetVariants` is a type helper that you can use to infer the type of variants that you can use in interfaces for your components.

```ts
import { GetVariants } from 'responsive-recipes';

type Variants = GetVariants<typeof stack>;
```
