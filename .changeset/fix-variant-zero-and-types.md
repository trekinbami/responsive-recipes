---
'responsive-recipes': patch
---

Fix: the value `0` is preserved across every variant lookup path, and recipes built from variant maps with unquoted numeric keys regain their inferred typing.

**Runtime**

- The regular variant lookup no longer drops `0` (mirrors the existing fix on the responsive path). `isStringOrNumber` is now a pure type narrow; it does not filter out falsy primitives.

**Types**

- `ValueMap` maps numeric-string variant keys (`'0'`, `'16'`) to numbers, and `'true' | 'false'` keys to `boolean`. Non-numeric string keys stay literal. The call-site form is the canonical one — no `0 | '0'` unions in editor hover.
- The `extends VariantRecord` constraint moved from `Args`' generic parameters to the field type via a new `InferredVariant` helper. This prevents TS from widening the inferred key set for recipes built from unquoted-numeric variant maps (e.g. a design-token `{ 0: ..., 16: ... }`), which previously collapsed every input to `string`.

**Migration**: callers passing variant values as strings for numeric-string keys (e.g. `padding: '16'`) need to switch to the canonical numeric form (`padding: 16`). Runtime behavior for them is unchanged.
