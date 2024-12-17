import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import { ComplexStyleRule, createVar, fallbackVar, style } from '@vanilla-extract/css';
import { createRuntimeFn } from './createRuntimeFn';

import type { Args, BuildResult, Conditions, InlineVariantGroup, VariantGroup } from './types';
import { extractValueFromVar, preventComposition } from './utils';

export function createRecipe<const DefaultConditions extends Conditions>({
  defaultConditions,
  initialCondition
}: {
  defaultConditions: DefaultConditions;
  initialCondition?: Extract<keyof DefaultConditions, string>;
}) {
  return <
    const V extends VariantGroup,
    const RV extends VariantGroup,
    const IV extends InlineVariantGroup,
    const C extends Conditions = DefaultConditions
  >(
    options: Args<V, RV, IV, C>,
    debugId?: string
  ) => {
    const {
      base = {},
      variants = {},
      responsiveVariants = {},
      inlineVariants,
      conditions = defaultConditions,
      compoundVariants = [],
      defaultVariants = {}
    } = options;

    // This config will hold all the classNames that the runtimeFn will use to select
    const config: BuildResult = {
      initialCondition: (options.initialCondition ?? initialCondition) || 'initial',
      conditions,
      baseClassName: '',
      variantClassNames: {},
      responsiveVariantClassNames: {},
      inlineVariantData: {},
      compoundVariants: [],
      defaultVariants
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
        group[variantOption] = {
          [config.initialCondition]: style(
            styleRule,
            debugId
              ? `${debugId}_${variantGroup}_${variantOption}`
              : `${variantGroup}_${variantOption}`
          )
        };
      }
    }

    // We go through every condition and generate a classname for each responsiveVariant for each breakpoint
    for (const conditionName in conditions) {
      for (const variantGroup in responsiveVariants) {
        const variantOptions = responsiveVariants[variantGroup];
        for (const variantOption in variantOptions) {
          const styleRule = preventComposition(variantOptions[variantOption]);

          const mediaQuery = conditions[conditionName]?.['@media'];
          const debugName = debugId
            ? `${debugId}_${conditionName}_${variantGroup}_${variantOption}`
            : `${conditionName}_${variantGroup}_${variantOption}`;

          // Every option has a style that needs to be wrapped in a media query
          const className = mediaQuery
            ? style({ '@media': { [mediaQuery]: styleRule } }, debugName)
            : style(styleRule, debugName);

          // Add the className to the nested config
          const group = config.responsiveVariantClassNames[variantGroup] || {};
          const option = group[variantOption] || {};

          config.responsiveVariantClassNames[variantGroup] = {
            ...group,
            [variantOption]: {
              ...option,
              [conditionName]: className
            }
          };
        }
      }
    }

    // Inline variants only need a single className for each variant. They will use inlined custom properties as values. These inlines custom properties will be set like: style={{'--width-mobile': '100px'; '--width-desktop': '200px';}}. So we need to generate a single className that will use the custom properties as values for each breakpoint

    for (const variantGroup in inlineVariants) {
      // Create a custom property with Vanilla-Extract's createVar function for each breakpoint
      const customProperties = {} as Record<string, string>;
      const variant = inlineVariants[variantGroup]!;

      const fallbacks = [];
      let rule: ComplexStyleRule = {};

      const cssProperty = variant.property;

      let bp: keyof typeof conditions & string;
      for (bp in conditions) {
        const conditionValue = conditions[bp];

        // This is used for the buildtime css
        const customProperty = createVar(`${variantGroup}-${bp}`);

        // This is used for the runtime
        const cleanVarName = extractValueFromVar(customProperty); // VE minifies classNames

        // Per breakpoint a clean var name in the buildresult
        customProperties[bp] = cleanVarName;

        const mq = conditionValue['@media'];
        if (!mq) {
          rule = {
            ...rule,
            [cssProperty]: customProperty
          };
          fallbacks.unshift(customProperty);

          continue;
        }

        rule = {
          ...rule,
          '@media': {
            ...rule['@media'],
            [mq]: {
              // When a custom property is missing, we want it to fall back to the previous breakpoint.
              // But custom properties inherit. So when a certain custom var/breakpoint is missing , it will inherit it from the previous scope.
              // To prevent this, we reset the custom property in the current scope with the fallback values we already have in place.
              [cleanVarName]: fallbackVar(customProperty, ...fallbacks),
              [cssProperty]: fallbackVar(customProperty, ...fallbacks)
            }
          }
        };

        fallbacks.unshift(customProperty);
      }

      const inlineVariantClassName = style(rule, `${debugId || ''}_inline_${variantGroup}`);
      config.inlineVariantData[variantGroup] = {
        className: inlineVariantClassName,
        style: customProperties
      };
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
     * That's why we need to generate a className for each breakpoint for each compoundVariant style that contains a responsive variant
     */
    for (const { style: theStyle, variants: theVariants } of compoundVariants) {
      const styleRule = preventComposition(theStyle);
      const compoundVariantClassNames = {} as Record<string, string>;

      const debugName = Object.entries(theVariants)
        .map(([key, value]) => `${key}_${value}`)
        .join('_');

      // If all variants in the compound are a regular variant, we only need to generate an initialCondition className
      const allRegularVariants = Object.keys(theVariants).every((variantGroup) =>
        Object.keys(variants).includes(variantGroup)
      );

      if (allRegularVariants) {
        const className = style(styleRule, `${debugId || ''}_compound_${debugName}`);
        compoundVariantClassNames[config.initialCondition] = className;
        config.compoundVariants.push([theVariants, compoundVariantClassNames]);
        continue;
      }

      for (const conditionName in conditions) {
        const mediaQuery = conditions[conditionName]?.['@media'];

        const responsiveStyleRule = mediaQuery
          ? { '@media': { [mediaQuery]: styleRule } }
          : styleRule;

        const className = style(
          responsiveStyleRule,
          `${debugId || ''}_compound_${debugName}_${conditionName}`
        );

        compoundVariantClassNames[conditionName] = className;
      }

      config.compoundVariants.push([theVariants, compoundVariantClassNames]);
    }

    const runtimeFn = createRuntimeFn<V, RV, IV, C>(config);

    return addFunctionSerializer(runtimeFn, {
      importPath: 'responsive-recipes',
      importName: 'createRuntimeFn',
      args: [config]
    });
  };
}
