import type { ComplexStyleRule } from '@vanilla-extract/css';

type Prettify<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type RecipeStyleRule = ComplexStyleRule | string;

// { isResponsive: { true: StyleRule, false: StyleRule } }
export type VariantGroup = Record<string, Record<string | number, RecipeStyleRule>> | undefined;

type ConditionKey = '@media' | '@supports' | '@container' | 'selector';

export type Conditions = {
  [conditionName: string]: { [key in ConditionKey]?: string };
};

type CombineVariants<V, RV> = Prettify<CreateVariants<V> & CreateVariants<RV>>;

type DefaultVariants<V, RV> = keyof RV | keyof V extends never ? never : CombineVariants<V, RV>;

type CompoundVariants<V, RV> = {
  variants: keyof V | keyof RV extends never ? never : CombineVariants<V, RV>;
  style: RecipeStyleRule;
}[];

export type Args<
  Variants extends VariantGroup,
  ResponsiveVariants extends VariantGroup,
  C extends Conditions | undefined
> = {
  base?: RecipeStyleRule;
  variants?: Variants;
  responsiveVariants?: ResponsiveVariants;
  conditions?: C;
  defaultVariants?: DefaultVariants<Variants, ResponsiveVariants>;
  compoundVariants?: CompoundVariants<Variants, ResponsiveVariants>;
} & (keyof C extends never
  ? { initialCondition?: never }
  : { initialCondition: Extract<keyof C, string> });

type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;

type CreateVariants<Variants> = keyof Variants extends never
  ? {}
  : { -readonly [K in keyof Variants]?: BooleanMap<keyof Variants[K]> };

type CreateResponsiveVariants<ResponsiveVariants, Conditions> =
  keyof ResponsiveVariants extends never
    ? {}
    : {
        -readonly [K in keyof ResponsiveVariants]?:
          | BooleanMap<keyof ResponsiveVariants[K]>
          | { -readonly [Key in keyof Conditions]?: BooleanMap<keyof ResponsiveVariants[K]> };
      };

export type RuntimeRecipeOptions<
  V extends VariantGroup,
  RV extends VariantGroup,
  DefaultConditions extends Conditions,
  C extends Conditions | undefined
> = Prettify<
  CreateVariants<V> & CreateResponsiveVariants<RV, keyof C extends never ? DefaultConditions : C>
>;

export type BuildResult = {
  baseClassName: string;
  variantClassNames: {
    [variantGroup: string]: { [variantOption: string]: { [initialBreakpoint: string]: string } };
  };
  responsiveVariantClassNames: {
    [variantGroup: string]: { [variantOption: string]: { [breakpoint: string]: string } };
  };
  compoundVariants: [{ [variantGroup: string]: string }, { [conditionName: string]: string }][];
  conditions: Conditions;
  initialCondition: string;
  defaultVariants: Record<string | number, string | number | boolean>;
};

export type RuntimeVariantGroup =
  | string
  | number
  | boolean
  | Record<string, string | number | boolean>;

export type GetVariants<T extends (...args: any) => any> = NonNullable<Parameters<T>[0]>;
