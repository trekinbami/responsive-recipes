import {
  BuildResult,
  Conditions,
  RuntimeRecipeOptions,
  RuntimeVariantGroup,
  VariantGroup,
} from './types';

function isStringOrNumber(obj: unknown): obj is string | number {
  return !!obj && (typeof obj === 'string' || typeof obj === 'number');
}

function isPrimitive(value: unknown): value is string | number | boolean {
  return value !== Object(value);
}

export function createRuntimeFn<
  V extends VariantGroup,
  RV extends VariantGroup,
  D extends Conditions,
  C extends Conditions | undefined
>(buildResult: BuildResult) {
  return (options?: RuntimeRecipeOptions<V, RV, D, C>) => {
    if (!options) {
      return buildResult.baseClassName;
    }

    // runtimeOptions is het object wat in runtime wordt meegegeven
    // om de classnames terug te krijgen van bepaalde variants
    const {
      variantClassNames,
      compoundVariants,
      baseClassName,
      initialCondition,
      responsiveVariantClassNames,
      defaultVariants,
    } = buildResult;

    type Selection = RuntimeRecipeOptions<V, RV, D, C>;
    const selection: Selection = { ...defaultVariants, ...options };
    const allVariantClassNames = { ...variantClassNames, ...responsiveVariantClassNames };

    /**
     * Base classname
     */
    const className = [baseClassName];

    /**
     * Regular Variants and Responsive Variants
     *
     * In our build function we've normalized regular variants to responsive variants based on the initialCondition so we can use the same runtime logic for both.
     */
    for (const variantGroup in selection) {
      let variantOption = selection[variantGroup] as RuntimeVariantGroup;

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
        const responsiveVariantOption = variantOption[condition]?.toString();
        if (!responsiveVariantOption) continue;

        className.push(variantClassNameGroup[responsiveVariantOption]?.[condition] || '');
      }
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
            ...variantOption,
          };

          for (const condition of orderedConditions) {
            const conditionOptionValue = variantOption[condition];
            optionValue = conditionOptionValue || optionValue; // Set the fallback value
            addedVariantOptionWithConditions[condition] = conditionOptionValue || optionValue;
          }

          return [variantGroup, addedVariantOptionWithConditions] as const;
        }
      );

      // Whenever all variants within this compound have the same selected value on the same condition, we get the className for that condition and push it to the className array
      for (const condition of orderedConditions) {
        const shouldPush = completedSelectionArray.every(
          ([variantGroup, selectionObj]) => selectionObj[condition] === variants[variantGroup]
        );

        const compoundClassName = classNamesPerCondition[condition];

        if (shouldPush && compoundClassName) {
          className.push(compoundClassName);
        }
      }
    }

    return className.filter(Boolean).join(' ');
  };
}
