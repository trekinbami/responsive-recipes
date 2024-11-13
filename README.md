# Responsive recipes

Responsive recipes is built on top of [Vanilla Extract](https://vanilla-extract.style/documentation/getting-started/). It provides variant based styling, including responsive variants, something that was missing in packages like [Recipes](https://vanilla-extract.style/documentation/packages/recipes/) and [cva](https://cva.style/docs).

This package assumes you have [Vanilla Extract](https://vanilla-extract.style/documentation/getting-started/) installed and configured.

## Installation

```
npm i responsive-recipes
```

## Getting started

To get started, create a recipe function that will have default conditions for which every responsive variant will get generated. Similar to [Sprinkles](https://vanilla-extract.style/documentation/packages/sprinkles/), it will need an `initialCondition` for calling singular string values on responsive variants.

```ts
import { createRecipe } from 'responsive-recipes';

const recipe = createRecipe({
  defaultConditions: {
    initial: {},
    sm: { '@media': '(min-width: 380px)' },
    lg: { '@media': '(min-width: 1024px)' }
  },
  initialCondition: 'initial'
});
```

We can use this `recipe` function to generate a piece of statically extracted CSS, powered by Vanilla Extract. Like regular recipes it can take an optional set of `base` styles, `variants`, `compoundVariants`, `defaultVariants`.

But `responsive-recipes` also takes in `responsiveVariants` and `inlineVariants`. Every responsive variant or inline variant, by default, will get generated for the conditions provided in `defaultConditions`.

```ts
const stack = recipe({
  base: {
    display: 'flex'
  },
  variants: {
    isFullHeight: {
      true: {
        height: '100%'
      },
      false: {
        height: 'auto'
      }
    }
  },
  responsiveVariants: {
    direction: {
      row: {
        flexDirection: 'row'
      },
      column: {
        flexDirection: 'column'
      }
    }
  },
  inlineVariants: {
    width: { property: 'width' },
    height: { property: 'height' }
  },
  compoundVariants: {
    variants: {
      direction: 'row',
      isFullHeight: true
    },
    style: {
      backgroundColor: 'green'
    }
  },
  defaultVariants: {
    isFullHeight: false,
    direction: 'row'
  }
});
```

## Runtime

In runtime code you can use the recipe to retrieve classNames:

```ts
const { className } = stack({
  isFullHeight: true,
  direction: { initial: 'column', lg: 'row' },
  width: { initial: '100%', sm: '50%', lg: '25%' }
});
```

## Responsive variants

Responsive variants get generated for each set condition in your defaultConditions configuration.

### The initialCondition is used as a fallback for responsive variants

Whenever you call a responsive variant with a singular value it will select the className that belongs to the media query defined in the `initialCondition`.

```ts
const { className } = stack({ direction: 'row' });
// Is equal to stack({ direction: { initial: 'row' }});
```

## Custom conditions

If you need to override the `defaultConditions` set in `createRecipe` on a per recipe basis, you can add a `conditions` property with an `initialCondition` to your recipe. Responsive variants in this recipe will only be generated for these `conditions`.

```ts
const hidden = recipe({
  conditions: {
    initial: {},
    sm: { '@media': '(min-width: 380px)' },
    smMax: { '@media': '(max-width: 379px)' },
    lg: { '@media': '(min-width: 1024px)' },
    lgMax: { '@media': '(max-width: 1023px)' }
  },
  initialCondition: 'initial',
  responsiveVariants: {
    hide: {
      true: {
        display: 'none'
      },
      false: {
        display: 'block'
      }
    }
  }
});
```

## Inline variants

Inline variants are special variants that allow any value and are coupled to a CSS property. These variants are very powerful, because they allow you to define any value, without having to explicitly define a variant for every single value. These are useful for CSS properties like `width`, `top`, `left`, etc. Inline variants are responsive by default. Inline variants also work with `compoundVariants` for granular control, and they can also have a `defaultVariant`.

Whenever you define `inlineVariants` your recipe will also return a `style` object that needs to added onto your DOM element (or component) in order to apply the variant:

```tsx
const { className, style } = stack({ width: { initial: '100%', sm: '50%' } });

<div className={className} style={style}>
  Stack
</div>;
```

## Compound variants

A compound variant is a variant that kicks in when a combination of variants, responsive variants and inline variants are active. These account for conditions as well. If we take our initial `stack` recipe:

```ts
const className = stack({
  isFullHeight: true,
  direction: { initial: 'column', lg: 'row' }
});
```

`isFullHeight` is a regular variant. Regular variants are valid for all conditions. That means that the compoundVariant combination will kick in from the `lg` breakpoint and the `backgroundColor` will become `green`.

## Default variants

Variants will fall back to the default variants if they're not defined in the runtime.

## Type helpers

`GetVariants` is a type helper that you can use to infer the type of variants that you can use in interfaces for your components.

```ts
import { GetVariants } from 'responsive-recipes';

type Variants = GetVariants<typeof stack>;
```

## Get base className

Often, when using `globalStyle` in Vanilla Extract, you want to target the base className. You can retrieve it using the `classNames.base` getter:

```ts
const baseClassName = stack.classNames.base;
```

## Variant definitions

For documentation purposes it might come in handy to get a list of all variants and their definitions. You can do this by calling `variantDefinitions` getters:

```ts
const variants = stack.variantDefinitions.variants;
const responsiveVariants = stack.variantDefinitions.responsiveVariants;
const inlineVariants = stack.variantDefinitions.inlineVariants;
```

A variant definition object has the following shape:

```ts
type VariantDefinition = {
  values: string[];
  defaultValue: string | undefined;
};
```
