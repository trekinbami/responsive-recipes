# responsive-recipes

## 0.1.6

### Patch Changes

- 613def1: Fix: the value `0` is preserved across every variant lookup path, and recipes built from variant maps with unquoted numeric keys regain their inferred typing.

  **Runtime**

  - The regular variant lookup no longer drops `0` (mirrors the existing fix on the responsive path). `isStringOrNumber` is now a pure type narrow; it does not filter out falsy primitives.

  **Types**

  - `ValueMap` maps numeric-string variant keys (`'0'`, `'16'`) to numbers, and `'true' | 'false'` keys to `boolean`. Non-numeric string keys stay literal. The call-site form is the canonical one — no `0 | '0'` unions in editor hover.
  - The `extends VariantRecord` constraint moved from `Args`' generic parameters to the field type via a new `InferredVariant` helper. This prevents TS from widening the inferred key set for recipes built from unquoted-numeric variant maps (e.g. a design-token `{ 0: ..., 16: ... }`), which previously collapsed every input to `string`.

  **Migration**: callers passing variant values as strings for numeric-string keys (e.g. `padding: '16'`) need to switch to the canonical numeric form (`padding: 16`). Runtime behavior for them is unchanged.

## 0.1.5

### Patch Changes

- This release will:

  - Force variant values to be strings. `{ gap: { 0: { gap: 0 } }` is not allowed anymore. Has to be `{ gap: { '0': { gap: 0 } }`
  - Fix an issue where passing `undefined` in runtime to an inlineVariant would cause an error

## 0.1.4

### Patch Changes

- 1b0b12b: Autocomplete CSS properties for inline variant properties

## 0.1.3

### Patch Changes

- 2a75995: Improve autocompletion on CSS properties

## 0.1.2

### Patch Changes

- 3c3d945: Bump dependencies

## 0.1.1

### Patch Changes

- c3aacc1: Add documentation for inline variants

## 0.1.0

### Minor Changes

- Add inlineVariants and variantDefinitions

## 0.0.10

### Patch Changes

- 100db1d: Support value "undefined" when getting classnames for variants in runtime by falling back to a defaultVariant when provided

## 0.0.9

### Patch Changes

- f8815a6: Fixes building compound variant classnames with an empty condition

## 0.0.8

### Patch Changes

- 752353d: Update readme to fix conditions

## 0.0.7

### Patch Changes

- 92ad0fe: Update package.json

## 0.0.6

### Patch Changes

- 89aa027: Update readme for empty initial condition

## 0.0.5

### Patch Changes

- 58e6f53: Allow empty condition to compile to base condition

## 0.0.4

### Patch Changes

- 0be909e: Make GetVariants NonNullable

## 0.0.3

### Patch Changes

- 296e774: Add basic readme

## 0.0.2

### Patch Changes

- 54324d4: toet
