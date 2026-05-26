import { describe, expect, it } from 'vitest';
import { box } from '../fixtures/falsy.css';

/**
 * Regression tests for responsive variant options whose lookup keys are valid
 * but happen to be JS-falsy.
 *
 * Object keys in JS are always strings, so when a recipe defines
 * `responsiveVariants: { padding: { '0': {...} } }` it's perfectly reasonable
 * for a consumer to call it with the number `0` (e.g. `{ md: 0 }`).
 * Before the fix, the runtime did `if (!responsiveVariantOption) continue;`
 * which silently dropped the `0` case.
 */
describe('responsive variant options with falsy-but-valid values', () => {
  it('applies the class when a responsive value is the string "0"', () => {
    const { className } = box({ padding: { initial: '16', md: '0' } });
    const classes = className.trim().split(/\s+/).filter(Boolean);

    // base + initial '16' + md '0' = 3 classes
    expect(classes.length).toBe(3);
    expect(className).toContain('padding_0');
    expect(className).toContain('md_padding_0');
  });

  it('applies the class when a responsive value is the number 0', () => {
    const { className } = box({ padding: { initial: 16, md: 0 } });
    const classes = className.trim().split(/\s+/).filter(Boolean);

    // base + initial '16' + md '0' = 3 classes
    expect(classes.length).toBe(3);
    expect(className).toContain('padding_0');
    expect(className).toContain('md_padding_0');
  });

  it('still skips a responsive value of undefined', () => {
    const { className } = box({ padding: { initial: '16', md: undefined } });
    const classes = className.trim().split(/\s+/).filter(Boolean);

    // base + initial '16' = 2 classes (no md)
    expect(classes.length).toBe(2);
    expect(className).not.toContain('md_padding');
  });
});
