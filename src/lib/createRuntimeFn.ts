import {
  BuildResult,
  Conditions,
  RuntimeRecipeOptions,
  RuntimeVariantGroup,
  VariantGroup,
} from './types';

function isPrimitive(obj: any): obj is string | number {
  return obj && (typeof obj === 'string' || typeof obj === 'number');
}

export function createRuntimeFn<
  V extends VariantGroup,
  RV extends VariantGroup,
  D extends Conditions,
  C extends Conditions | undefined
>(buildResult: BuildResult) {
  return (options: RuntimeRecipeOptions<V, RV, D, C>) => {
    // runtimeOptions is het object wat in runtime wordt meegegeven
    // om de classnames terug te krijgen van bepaalde variants
    const {
      variantClassNames,
      compoundVariants,
      conditions,
      baseClassName,
      initialCondition,
      responsiveVariantClassNames,
      defaultVariants,
    } = buildResult;

    const selection: RuntimeRecipeOptions<V, RV, D, C> = { ...defaultVariants, ...options };
    const className = [baseClassName];
    const allVariantClassNames = { ...variantClassNames, ...responsiveVariantClassNames };

    /**
     * { padding: 'compact', size: { initial: "small", md: "large" } }
     */
    for (const variantGroup in selection) {
      let variantOption = selection[variantGroup] as RuntimeVariantGroup;

      if (typeof variantOption === 'boolean') {
        variantOption = variantOption === true ? 'true' : 'false';
      }

      const variantClassNameGroup = allVariantClassNames[variantGroup];
      if (!variantClassNameGroup) continue;

      // { padding: 'compact' }
      if (isPrimitive(variantOption)) {
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

    // Which compound variants should we apply?
    // First we filter out all compound variants that do not match the current selection
    const matchingCompoundVariants = compoundVariants.filter(([variants]) =>
      Object.keys(variants).every((variantGroup) => Object.keys(selection).includes(variantGroup))
    );

    // Then we collect the needed classnames based on the selection
    for (const [variants, classNamesPerCondition] of matchingCompoundVariants) {
      let compoundClassNames: string[] = [];
      let shouldApply = true;

      compoundVariantLoop: for (const variantGroup in variants) {
        const variantOption = variants[variantGroup];
        if (!variantOption) {
          shouldApply = false;
          break compoundVariantLoop;
        }

        // Check the selection if the variantGroup with the variantOption is selected (on a certain breakpoint)
        // If so, get the className for that variantOption and push it to the compoundClassNames array
        selectionLoop: for (const selectedVariantGroup in selection) {
          // If the group is not selected, we should not apply this compound variant
          if (variantGroup !== selectedVariantGroup) {
            shouldApply = false;
            break selectionLoop;
          }

          // The group is selected, so lets check if we can find a value thats equal to the variantOption
          const selectedVariantOption = selection[selectedVariantGroup];
          if (!selectedVariantOption) {
            shouldApply = false;
            break selectionLoop;
          }

          // Normalize the lookup table, so we always have an object to choose our className from
          const selectedVariantConditionMap =
            isPrimitive(selectedVariantOption) || typeof selectedVariantOption === 'boolean'
              ? { [initialCondition]: selectedVariantOption }
              : selectedVariantOption;

          // If theres a condition with a value that matches the variantOption, we can apply the compound variant
          for (const condition in selectedVariantConditionMap) {
            // Last steps here
            // const selectedVariantOptionValue = selectedVariantConditionMap[condition];
            // if (selectedVariantOptionValue === variantOption) {
            //   compoundClassNames.push(classNamesPerCondition[condition]);
            // }
          }
        }
      }

      if (shouldApply) {
        className.push(compoundClassNames.join(' '));
      }
    }

    return className.filter(Boolean).join(' ');
  };
}
