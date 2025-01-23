import type { ComplexStyleRule, CSSProperties } from '@vanilla-extract/css';

type Prettify<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type ConditionKey = '@media' | '@supports' | '@container' | 'selector';

type AutoCompletedCSSProperties = keyof CSSProperties | (string & {});

export type Conditions = {
  [conditionName: string]: { [key in ConditionKey]?: string };
};

type CombineVariants<V, RV, IV> = Prettify<
  CreateVariants<V> & CreateVariants<RV> & { [K in keyof IV]?: string }
>;

type DefaultVariants<V, RV, IV> = [keyof RV | keyof V | keyof IV] extends [never]
  ? never
  : CombineVariants<V, RV, IV>;

type CompoundVariants<V, RV, IV> = {
  variants: [keyof V | keyof RV | keyof IV] extends [never] ? never : CombineVariants<V, RV, IV>;
  style: RecipeStyleRule;
}[];

type InferredVariant<T> = {
  [K in keyof T]: { [Key in keyof T[K]]: RecipeStyleRule };
};

type ValueMap<T> = T extends 'true' | 'false'
  ? boolean
  : T extends `${infer N extends number}`
    ? N
    : T;

type CreateVariants<Variants> = {
  [K in keyof Variants]?: ValueMap<keyof Variants[K]>;
};

type CreateResponsiveVariants<ResponsiveVariants, Conditions> = {
  [K in keyof ResponsiveVariants]?:
    | ValueMap<keyof ResponsiveVariants[K]>
    | { [Key in keyof Conditions]?: ValueMap<keyof ResponsiveVariants[K]> };
};

type CreateInlineVariants<InlineVariants, Conditions> = {
  [K in keyof InlineVariants]?: string | { [Key in keyof Conditions]?: string };
};

export type RecipeStyleRule = ComplexStyleRule | string;

export type Args<V, RV, IV, C extends Conditions> = {
  base?: RecipeStyleRule;
  variants?: InferredVariant<V>;
  responsiveVariants?: InferredVariant<RV>;
  defaultVariants?: DefaultVariants<V, RV, IV>;
  compoundVariants?: CompoundVariants<V, RV, IV>;
  inlineVariants?: { [K in keyof IV]: { property: AutoCompletedCSSProperties } };
} & (
  | {
      conditions: C;
      initialCondition: Extract<keyof C, string>;
    }
  | {
      initialCondition?: never;
      conditions?: never;
    }
);

export type RuntimeRecipeOptions<V, RV, IV, C extends Conditions> = CreateVariants<V> &
  CreateResponsiveVariants<RV, C> &
  CreateInlineVariants<IV, C>;

export type BuildResult = {
  baseClassName: string;
  variantClassNames: {
    [variantGroup: string]: { [variantOption: string]: { [initialBreakpoint: string]: string } };
  };
  responsiveVariantClassNames: {
    [variantGroup: string]: { [variantOption: string]: { [breakpoint: string]: string } };
  };
  inlineVariantData: {
    [variantGroup: string]: { className: string; style: { [breakpoint: string]: string } };
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

export type GetVariants<T extends (...args: any) => any> = Prettify<NonNullable<Parameters<T>[0]>>;
