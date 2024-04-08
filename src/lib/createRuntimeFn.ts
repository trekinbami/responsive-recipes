import {
  BuildResult,
  Conditions,
  RuntimeRecipeOptions,
  RuntimeVariantGroup,
  VariantGroup,
} from './types';
import { isPrimitive, isStringOrNumber } from './utils';

export function createRuntimeFn<
  V extends VariantGroup,
  RV extends VariantGroup,
  D extends Conditions,
  C extends Conditions | undefined
>(buildResult: BuildResult) {
  return (options?: RuntimeRecipeOptions<V, RV, D, C>) => {
    const {
      variantClassNames,
      compoundVariants,
      baseClassName,
      initialCondition,
      responsiveVariantClassNames,
      defaultVariants,
    } = buildResult;

    const selection = options ? { ...defaultVariants, ...options } : defaultVariants;
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
        let responsiveVariantOption = variantOption[condition];

        if (typeof responsiveVariantOption === 'boolean') {
          responsiveVariantOption = responsiveVariantOption === true ? 'true' : 'false';
        }

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

    return className.join(' ');
  };
}
