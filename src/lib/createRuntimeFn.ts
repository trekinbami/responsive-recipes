import {
  BuildResult,
  Conditions,
  InlineVariantGroup,
  RuntimeRecipeOptions,
  RuntimeVariantGroup,
  VariantGroup
} from './types';
import { isPrimitive, isStringOrNumber } from './utils';

export function createRuntimeFn<
  V extends VariantGroup,
  RV extends VariantGroup,
  IV extends InlineVariantGroup,
  C extends Conditions
>(buildResult: BuildResult) {
  const runtimeFn = (options?: RuntimeRecipeOptions<V, RV, IV, C>) => {
    const {
      variantClassNames,
      compoundVariants,
      baseClassName,
      initialCondition,
      responsiveVariantClassNames,
      defaultVariants,
      inlineVariantData
    } = buildResult;

    const selection = options ? { ...defaultVariants, ...options } : defaultVariants;
    const allVariantClassNames = { ...variantClassNames, ...responsiveVariantClassNames };

    /**
     * Base classname
     */
    const className = [baseClassName];
    let styleProps: Record<string, string> = {};

    /**
     * Regular Variants and Responsive Variants
     *
     * In our build function we've normalized regular variants to responsive variants based on the initialCondition so we can use the same runtime logic for both.
     */

    for (const variantGroup in selection) {
      let variantOption = selection[variantGroup] as RuntimeVariantGroup | undefined;

      // If the key is provided, but the value is undefined, we should try to fall back to the default variant
      if (variantOption === undefined) {
        variantOption = defaultVariants[variantGroup];
      }

      if (typeof variantOption === 'boolean') {
        variantOption = variantOption === true ? 'true' : 'false';
      }

      const variantClassNameGroup = allVariantClassNames[variantGroup];
      if (!variantClassNameGroup) continue;

      // { padding: 'compact' }
      if (isStringOrNumber(variantOption)) {
        className.push(variantClassNameGroup[variantOption]?.[initialCondition] || '');
        continue;
      }

      // { size: { initial: "small", md: "large" } }
      for (const condition in variantOption) {
        let responsiveVariantOption = variantOption[condition];

        if (typeof responsiveVariantOption === 'boolean') {
          responsiveVariantOption = responsiveVariantOption === true ? 'true' : 'false';
        }

        if (!responsiveVariantOption) continue;

        className.push(variantClassNameGroup[responsiveVariantOption]?.[condition] || '');
      }
    }

    /**
     * Inline variants
     * Check if we have inline variants that need to be applied and get classNames for each variant defined in the options. Also get the appropriate breakpoints from the style in the buildresult that are defined in the options
     */

    const inlineVariantOptions = Object.entries(inlineVariantData).filter(
      ([variantGroup]) => variantGroup in selection
    );

    for (const [variantGroup, variantData] of inlineVariantOptions) {
      const selectionVariantOption = selection[variantGroup] as RuntimeVariantGroup;

      const inlineVariantClassName = variantData.className;
      className.push(inlineVariantClassName);

      if (isPrimitive(selectionVariantOption)) {
        const initialStyleProperty = variantData.style[initialCondition];
        if (!initialStyleProperty) continue;
        styleProps = { ...styleProps, [initialStyleProperty]: selectionVariantOption.toString() };
        continue;
      }

      // Filer the style for the breakpoints that are defined in the options and merge them with the styleProps
      const style = Object.entries(variantData.style)
        .filter(([bp]) => bp in selectionVariantOption)
        .map(([bp, styleProperty]) => [styleProperty, selectionVariantOption[bp]]);

      styleProps = { ...styleProps, ...Object.fromEntries(style) };
    }

    /**
     * Compound variants
     * Check which compound variants should we apply?
     */
    // First we filter out all compound variants that do not match the current selection for optimalisation
    const matchingCompoundVariants = compoundVariants.filter(([variants]) =>
      Object.keys(variants).every((variantGroup) => Object.keys(selection).includes(variantGroup))
    );

    // Then we collect the needed classnames based on the selection
    for (const [variants, classNamesPerCondition] of matchingCompoundVariants) {
      // We only need variantGroups that are available in the compound variant config
      const selectionArray = Object.entries<RuntimeVariantGroup>(selection);
      const filteredSelectionArray = selectionArray.filter(
        ([variantGroup]) => variantGroup in variants
      );

      const normalizedSelectionArray = filteredSelectionArray.map(
        ([variantGroup, variantOption]) => {
          return isPrimitive(variantOption)
            ? ([variantGroup, { [initialCondition]: variantOption }] as const)
            : ([variantGroup, variantOption] as const);
        }
      );

      const orderedConditions = Object.keys(classNamesPerCondition);

      // Normalize the filteredSelection, so every selected variant has a value for each condition
      const completedSelectionArray = normalizedSelectionArray.map(
        ([variantGroup, variantOption]) => {
          let optionValue = undefined;
          let addedVariantOptionWithConditions = {
            [initialCondition]: undefined,
            ...variantOption
          };

          for (const condition of orderedConditions) {
            const conditionOptionValue = variantOption[condition];
            optionValue = conditionOptionValue ?? optionValue; // Set the fallback value
            addedVariantOptionWithConditions[condition] = optionValue;
          }

          return [variantGroup, addedVariantOptionWithConditions] as const;
        }
      );

      // Whenever all variants within this compound have the same selected value on the same condition, we get the className for that condition and push it to the className array
      let wasEqual = false;
      for (const condition of orderedConditions) {
        const isEqual = completedSelectionArray.every(
          ([variantGroup, selectionObj]) => selectionObj[condition] === variants[variantGroup]
        );

        // If a condition is equal to the previous condition, do not include it, because we assume min width media queries for now
        // This is a bad assumption, but i've never needed anything else. We can easily omit this if needed.
        const shouldInclude = wasEqual;
        wasEqual = isEqual;
        if (shouldInclude && isEqual) {
          continue;
        }

        const compoundClassName = classNamesPerCondition[condition];

        if (isEqual && compoundClassName) {
          className.push(compoundClassName);
        }
      }
    }

    return { className: className.join(' '), style: styleProps };
  };

  runtimeFn.classNames = {
    get base() {
      return buildResult.baseClassName;
    }
  };

  type VariantDefinitions = {
    [index: string]: {
      values: string[];
      defaultValue?: string;
    };
  };
  type Options = Record<string, Record<string, unknown>>;

  function getVariantDefinitions(options: Options) {
    const result: VariantDefinitions = {};
    for (const key in options) {
      result[key] = {
        values: Object.keys(options[key] ?? {}),
        defaultValue: buildResult.defaultVariants[key]?.toString()
      };
    }

    return result;
  }

  runtimeFn.variantDefinitions = {
    get variants() {
      return getVariantDefinitions(buildResult.variantClassNames);
    },

    get responsiveVariants() {
      return getVariantDefinitions(buildResult.responsiveVariantClassNames);
    },

    get inlineVariants() {
      const options: Options = {};
      for (const key in buildResult.inlineVariantData) {
        options[key] = {};
      }

      return getVariantDefinitions(options);
    },

    get defaultVariants() {
      return buildResult.defaultVariants;
    }
  };

  return runtimeFn;
}
