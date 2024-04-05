import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import { style } from '@vanilla-extract/css';
import { createRuntimeFn } from './createRuntimeFn';

import type { Args, BuildResult, Conditions, RecipeStyleRule, VariantGroup } from './types';

// Example
// const config1 = {
//   variantClassNames: {
//     variantGroup: {
//       variantOption: {
//         initial: 'className',
//         xl: 'className',
//       },
//     },
//   },
//   compoundVariants: [
//     [{ variantGroup: 'variantName', variantGroup2: 'variantName2' }, 'className'],
//     [{ variantGroup: 'variantName', variantGroup2: 'variantName2' }, 'className'],
//   ],
// };

// We do not allow composition with existing classNames on variants for now
const preventComposition = (styleRule?: RecipeStyleRule) => {
  if (!styleRule || typeof styleRule === 'string' || Array.isArray(styleRule)) {
    throw new Error('We only allow style objects inside of variants');
  }

  return styleRule;
};

export function createRecipe<const DefaultConditions extends Conditions>({
  defaultConditions,
  initialCondition,
}: {
  defaultConditions: DefaultConditions;
  initialCondition?: Extract<keyof DefaultConditions, string>;
}) {
  return <
    const V extends VariantGroup,
    const RV extends VariantGroup,
    const C extends Conditions | undefined
  >(
    options: Args<V, RV, C>,
    debugId?: string
  ) => {
    const {
      base = {},
      variants = {},
      responsiveVariants = {},
      conditions = defaultConditions,
      compoundVariants = [],
      defaultVariants = {},
    } = options;

    // This config will hold all the classNames that the runtimeFn will use to select
    const config: BuildResult = {
      initialCondition: initialCondition || 'initial',
      conditions,
      responsiveVariantClassNames: {},
      variantClassNames: {},
      compoundVariants: [],
      defaultVariants,
      baseClassName: '',
    };

    // First we generate a basic className for the base styles
    config.baseClassName = typeof base === 'string' ? base : style(base, debugId);

    // We generate a className for each variant option that has a styleRule
    for (const variantGroup in variants) {
      config.variantClassNames[variantGroup] = {};

      // we know this always exists, because we've set it above, but this is to appease Typescript
      const group = config.variantClassNames[variantGroup];
      if (!group) continue;

      const variantOptions = variants[variantGroup];

      // Every option should generate a className
      for (const variantOption in variantOptions) {
        const styleRule = preventComposition(variantOptions[variantOption]);
        group[variantOption] = { [config.initialCondition]: style(styleRule, debugId) };
      }
    }

    // We go through every condition and generate a classname for each responsiveVariant for each breakpoint
    for (const conditionName in conditions) {
      for (const variantGroup in responsiveVariants) {
        const variantOptions = responsiveVariants[variantGroup];

        for (const variantOption in variantOptions) {
          const styleRule = preventComposition(variantOptions[variantOption]);

          const mediaQuery = conditions[conditionName]?.['@media'];
          if (!mediaQuery) continue;

          // Every option has a style that needs to be wrapped in a media query
          const responsiveStyleRule = { '@media': { [mediaQuery]: styleRule } };
          const className = style(
            responsiveStyleRule,
            debugId
              ? `${debugId}_${conditionName}_${variantGroup}_${variantOption}`
              : `${conditionName}_${variantGroup}_${variantOption}`
          );

          // Add the className to the nested config
          const group = config.responsiveVariantClassNames[variantGroup] || {};
          const option = group[variantOption] || {};

          config.responsiveVariantClassNames[variantGroup] = {
            ...group,
            [variantOption]: {
              ...option,
              [conditionName]: className,
            },
          };
        }
      }
    }

    /**
     * Lets say we have the following example:
     *
     *    variants: { isResponsive: { false: {}, true: {}}}
     *    responsiveVariants: { size: { small: {}, large: {} }}
     *    compoundVariants: [{
     *        variants: { isResponsive: true, size: 'small' },
     *        style: { // styles }
     *    }]
     *
     * And in the runtime the following is passed:
     *   { isResponsive: true, size: { initial: 'large', md: 'small' } }
     *
     * That means that the compoundVariant should kick in from the 'md' breakpoint.
     * That's why we need to generate a className for each breakpoint for each compoundVariant style
     */
    for (const { style: theStyle, variants } of compoundVariants) {
      const styleRule = preventComposition(theStyle);
      const compoundVariantClassNames = {} as Record<string, string>;

      for (const conditionName in conditions) {
        const mediaQuery = conditions[conditionName]?.['@media'];
        if (!mediaQuery) continue;

        const responsiveStyleRule = { '@media': { [mediaQuery]: styleRule } };
        const debugName = Object.entries(variants)
          .map(([key, value]) => `${key}_${value}`)
          .join('_');

        const className = style(
          responsiveStyleRule,
          `${debugId || ''}_compound_${debugName}_${conditionName}`
        );

        compoundVariantClassNames[conditionName] = className;
      }

      config.compoundVariants.push([variants, compoundVariantClassNames]);
    }

    const runtimeFn = createRuntimeFn<V, RV, DefaultConditions, C>(config);

    return addFunctionSerializer(runtimeFn, {
      importPath: 'src/lib/createRuntimeFn',
      importName: 'createRuntimeFn',
      args: [config],
    });
  };
}
