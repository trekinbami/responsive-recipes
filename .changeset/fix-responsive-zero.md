---
'responsive-recipes': patch
---

Fix: responsive variant options no longer silently drop the value `0`.

Previously, the runtime used `if (!responsiveVariantOption) continue;`, which treats `0` (number) as a missing value. With this change, `0` is coerced to `'0'` before the falsy check, matching the way JS object keys work and aligning with the intent of recipes like `padding: { '0': {...}, '16': {...} }`.

The `ValueMap` type helper has also been extended so that numeric-string variant keys (e.g. `'0'`, `'16'`) accept both the string and the number version, mirroring the existing `'true' | 'false'` → `boolean` coercion. This means `{ md: 0 }` is now a first-class typed input.
