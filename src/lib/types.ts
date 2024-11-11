import type { CSSProperties, ComplexStyleRule } from '@vanilla-extract/css';

type Prettify<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type RecipeStyleRule = ComplexStyleRule | string;

// { isResponsive: { true: StyleRule, false: StyleRule } }
export type VariantGroup = Record<string, Record<string | number, RecipeStyleRule>> | undefined;
export type InlineVariantGroup = Record<
  string,
  { property: keyof CSSProperties; isResponsive?: boolean }
>;

type ConditionKey = '@media' | '@supports' | '@container' | 'selector';

export type Conditions = {
  [conditionName: string]: { [key in ConditionKey]?: string };
};

type InlineVariants<IV> = { [K in keyof IV]?: string };

type CombineVariants<V, RV, IV> = Prettify<
  CreateVariants<V> & CreateVariants<RV> & InlineVariants<IV>
>;

type DefaultVariants<V, RV, IV> = keyof RV | keyof V | keyof IV extends never
  ? never
  : CombineVariants<V, RV, IV>;

type CompoundVariants<V, RV, IV> = {
  variants: keyof V | keyof RV | keyof IV extends never ? never : CombineVariants<V, RV, IV>;
  style: RecipeStyleRule;
}[];

export type Args<
  Variants extends VariantGroup,
  ResponsiveVariants extends VariantGroup,
  InlineVariants extends InlineVariantGroup,
  C extends Conditions
> = {
  base?: RecipeStyleRule;
  variants?: Variants;
  responsiveVariants?: ResponsiveVariants;
  defaultVariants?: DefaultVariants<Variants, ResponsiveVariants, InlineVariants>;
  compoundVariants?: CompoundVariants<Variants, ResponsiveVariants, InlineVariants>;
  inlineVariants?: InlineVariants;
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

type BooleanMap<T> = T extends 'true' | 'false' ? boolean : T;

type CreateVariants<Variants> = {
  -readonly [K in keyof Variants]?: BooleanMap<keyof Variants[K]>;
};

type CreateResponsiveVariants<ResponsiveVariants, Conditions> = {
  -readonly [K in keyof ResponsiveVariants]?:
    | BooleanMap<keyof ResponsiveVariants[K]>
    | { -readonly [Key in keyof Conditions]?: BooleanMap<keyof ResponsiveVariants[K]> };
};

type CreateInlineVariants<InlineVariants, Conditions> = {
  -readonly [K in keyof InlineVariants]?: string | { -readonly [Key in keyof Conditions]?: string };
};

export type RuntimeRecipeOptions<
  V extends VariantGroup,
  RV extends VariantGroup,
  IV extends InlineVariantGroup,
  C extends Conditions
> = Prettify<CreateVariants<V> & CreateResponsiveVariants<RV, C> & CreateInlineVariants<IV, C>>;

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

export type GetVariants<T extends (...args: any) => any> = NonNullable<Parameters<T>[0]>;
