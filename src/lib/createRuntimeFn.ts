import { Args, BuildResult, Conditions, RecipeOptions, VariantGroup } from './types';

export function createRuntimeFn<
  V extends VariantGroup,
  RV extends VariantGroup,
  D extends Conditions,
  C extends Conditions
>(buildResult: BuildResult<V, RV>) {
  return (runtimeVariants: RecipeOptions<V, RV, D, C>) => {
    // runtimeOptions is het object wat in runtime wordt meegegeven
    // om de classnames terug te krijgen van bepaalde variants
    for (const variant in runtimeVariants) {
      // zoek de variant in de buildresult en doe er wat mee
      console.log(variant);
    }

    // Hier gaan we de juiste classNames teruggeven op basis van runtime config
    return 'toet' as const;
  };
}
