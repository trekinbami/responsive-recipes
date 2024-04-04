import type { ComplexStyleRule } from '@vanilla-extract/css';

type Prettify<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type RecipeStyleRule = ComplexStyleRule | string;

// { isResponsive: { true: StyleRule, false: StyleRule } }
export type VariantGroup =
  | Record<string | number, Record<string | number, RecipeStyleRule>>
  | undefined;

type ConditionKey = '@media' | '@supports' | '@container' | 'selector';

export type Conditions = {
  [conditionName: string]: { [key in ConditionKey]?: string };
};

type CombineVariants<V, RV> = Prettify<CreateVariants<V> & CreateVariants<RV>>;

/**
 * If no variants are provided, we do not accept defaultVariants (never)
 * If variants are provided we try to combine the available variants
 */
type DefaultVariants<V, RV> = keyof RV | keyof V extends never ? never : CombineVariants<V, RV>;

export type Args<
  Variants extends VariantGroup = VariantGroup,
  ResponsiveVariants extends VariantGroup = VariantGroup,
  C extends Conditions = Conditions
> = {
  base?: RecipeStyleRule;
  variants?: Variants;
  responsiveVariants?: ResponsiveVariants;
  conditions?: C;
  defaultVariants?: DefaultVariants<Variants, ResponsiveVariants>;
  // TODO: Dont allow if no variants are provided
  compoundVariants?: {
    variants: CombineVariants<Variants, ResponsiveVariants>;
    style: RecipeStyleRule;
  }[];
};

type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;

type CreateVariants<Variants> = { -readonly [K in keyof Variants]?: BooleanMap<keyof Variants[K]> };

type CreateResponsiveVariants<ResponsiveVariants, Conditions> = keyof Conditions extends never
  ? {}
  : {
      -readonly [K in keyof ResponsiveVariants]?:
        | BooleanMap<keyof ResponsiveVariants[K]>
        | { -readonly [Key in keyof Conditions]?: BooleanMap<keyof ResponsiveVariants[K]> };
    };

export type RecipeOptions<
  V extends VariantGroup,
  RV extends VariantGroup,
  D extends Conditions,
  C extends Conditions
> = Prettify<CreateVariants<V> & CreateResponsiveVariants<RV, Omit<D, keyof C> & C>>;

export type BuildResult<Variants extends VariantGroup, ResponsiveVariants extends VariantGroup> = {
  defaultClassName: string;
  variantClassNames: { [variantGroup: string]: { [variantOption: string]: string } };
  responsiveVariantClassNames: {
    [variantGroup: string]: { [variantOption: string]: { [breakpoint: string]: string } };
  };
  // The className is the custom `style` property of the compoundVariant
  compoundVariants: [Record<string, string | boolean>, string][];
};

export type GetVariants<T extends (...args: any) => any> = Parameters<T>[0];

// function createRecipe<const D>(defaultConditions: {
//   defaultConditions?: D;
//   initialCondition: keyof D;
// }) {
//   return <const V extends VariantGroup, const RV extends VariantGroup, const C extends Conditions>(
//     args: Args<V, RV, C>
//   ) => {
//     return (options: RecipeOptions<V, RV, D, C>) => {
//       // Hier wat logica..
//       return '';
//     };
//   };
// }

// const recipe = createRecipe({
//   defaultConditions: { initial: '@media', sm: '@media blabla', xl: '@media blabla' },
//   initialCondition: 'initial',
// });

// const stack = recipe({
//   conditions: {
//     // They currently get merged, but maybe we should override to give complete control?
//     sm: { '@media': 'bla' },
//     xl: { '@media': 'bla' },
//     mega: { '@media': 'bla' },
//   },
//   variants: {
//     size: {
//       large: {
//         flexDirection: 'row',
//       },
//       small: {},
//     },
//   },
//   responsiveVariants: {
//     isResponsive: {
//       false: {},
//       true: {},
//     },
//     direction: {
//       row: {
//         flex: 'auto',
//       },
//       column: {},
//     },
//     spacing: {
//       0: { margin: '0px' },
//       1: { margin: '4px' },
//       2: { margin: '8px' },
//       3: { margin: '12px' },
//       4: { margin: '16px' },
//       5: { margin: '20px' },
//     },
//   },
//   defaultVariants: {
//     // toet: "bla",
//     direction: 'row',
//     size: 'large',
//   },
//   compoundVariants: [
//     {
//       variants: {
//         spacing: 1,
//         direction: 'row',
//       },
//       style: {
//         flexDirection: 'row',
//       },
//     },
//     {
//       variants: {
//         spacing: 2,
//         direction: 'row',
//       },
//       style: {
//         gridColumn: 5,
//       },
//     },
//   ],
// });

// const result = stack({ isResponsive: { initial: true, mega: false } });
