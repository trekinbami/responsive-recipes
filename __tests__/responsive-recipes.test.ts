import { expect, describe, it } from 'vitest';
import { stack } from './responsive-recipes.css';

describe('responsive-recipe runtime function', () => {
  it('should return a class name without any config that should be present in every returned combined class name of the runtime function', () => {
    expect(stack()).toBe('responsive-recipes__ublbf0');
  });

  it('should return a class name with a regular variant', () => {
    expect(stack({ size: 'small' })).toBe('responsive-recipes__ublbf0 responsive-recipes__ublbf1');
  });

  it('should return multiple classes for multiple regular variants', () => {
    const result = stack({ size: 'small', isDesktop: true });
    expect(result).toBe(
      'responsive-recipes__ublbf0 responsive-recipes__ublbf1 responsive-recipes__ublbf3'
    );
  });

  it('should return a class for a responsive variant that is called with a string', () => {
    const result = stack({ backgroundColor: 'green' });
    expect(true).toBe(false);
  });

  it('should return a class for a responsive variant that is called with a number', () => {
    const result = stack({ gap: 1 });
    expect(true).toBe(false);
  });

  it('should return a class for a responsive variant that is called with a boolean', () => {
    const result = stack({ isDesktop: true });
    expect(true).toBe(false);
  });

  it('should return a class for each condition in a responsive variant that is called with conditions', () => {
    const result = stack({ backgroundColor: { initial: 'green', md: 'blue', lg: 'green' } });
    expect(true).toBe(false);

    const resul1 = stack({ backgroundColor: { initial: 'green', md: 'blue' } });
    expect(true).toBe(false);

    const result2 = stack({ backgroundColor: { initial: 'green' } });
    expect(true).toBe(false);
  });

  describe('should return the correct classes when', () => {
    it('multiple responsive variants are passed', () => {
      const result = stack({
        backgroundColor: { initial: 'green', md: 'blue', lg: 'green' },
        gap: { initial: 1, md: 2, lg: 3 },
      });
      expect(true).toBe(false);
    });

    it('regular and responsive variants are passed', () => {
      const result = stack({
        size: 'small',
        backgroundColor: { initial: 'green', md: 'blue', lg: 'green' },
      });

      expect(true).toBe(false);
    });

    it('responsive variants are passed with a primitive and conditions in the same call', () => {
      const result = stack({
        backgroundColor: 'green',
        gap: { initial: 1, md: 2, lg: 3 },
      });

      expect(true).toBe(false);
    });

    it('a compound variant is passed with regular string variants', () => {
      const result = stack({ size: 'small', spacing: 'compact' });
      expect(true).toBe(false);
    });

    it('a compound variant is passed a regular boolean variant', () => {
      const result = stack({ isDesktop: false, spacing: 'compact' });
      expect(true).toBe(false);
    });

    it('a compound variant is passed a regular number variant', () => {
      const result = stack({ spacing: 'normal', amountOfCols: 12 });
      expect(true).toBe(false);
    });

    it('a compound variant is passed with responsive variants', () => {
      const result = stack({
        direction: { initial: 'column', md: 'row' },
        backgroundColor: { initial: 'green', md: 'blue', lg: 'green' },
      });

      expect(true).toBe(false);
    });

    it('a compound variant is passed with a responsive string variant', () => {
      const result = stack({
        size: 'small',
        backgroundColor: 'green',
      });

      expect(true).toBe(false);
    });

    it('a compound variant is passed with a responsive boolean variant', () => {
      const result = stack({
        size: 'small',
        isFullHeight: false,
      });

      expect(true).toBe(false);
    });

    it('a compound variant is passed with a responsive number variant', () => {
      const result = stack({
        spacing: 'normal',
        gap: 1,
      });

      expect(true).toBe(false);
    });

    it('a compound variant is passed with mixed responsive variants and regular variants', () => {
      const result = stack({
        size: 'small',
        direction: { initial: 'column', md: 'row' },
        backgroundColor: { initial: 'green', md: 'blue', lg: 'green' },
      });

      expect(true).toBe(false);
    });

    it('should return the default variant for variants when no variant is passed', () => {
      const result = stack();
      expect(true).toBe(false);
    });

    it('should not return any extra classes when no variants are passed and no default variant is available', () => {
      const result = stack();
      expect(true).toBe(false);
    });
  });

  it('should only return responsive variants based on the conditions', () => {});
});

describe('responsive-recipe buildtime function', () => {
  it('should return the classNames for variants when calling the getter', () => {
    const result = stack.get();
    expect(true).toBe(false);
  });
});
