import { expect, describe, it } from 'vitest';
import { stack, heading } from '../fixtures/style.css';

describe('responsive-recipe runtime function', () => {
  it('without config it should return a single class name that should be present in every returned combined class name of the runtime function', () => {
    expect(stack()).toBe('style__1rdq1cn0');
  });

  it('should return a class name with a regular variant', () => {
    expect(stack({ size: 'small' })).toBe('style__1rdq1cn0 style_size_small__1rdq1cn1');
  });

  it('should return multiple classes for multiple regular variants', () => {
    const result = stack({ size: 'small', isDesktop: true });
    expect(result).toBe(
      'style__1rdq1cn0 style_size_small__1rdq1cn1 style_isDesktop_true__1rdq1cn5'
    );
  });

  it('should return a class for a responsive variant that is called with a string', () => {
    const result = stack({ backgroundColor: 'green' });
    expect(result).toBe('style__1rdq1cn0 style_initial_backgroundColor_green__1rdq1cn9');
  });

  it('should return a class for a responsive variant that is called with a number', () => {
    const result = stack({ gap: 1 });
    expect(result).toBe('style__1rdq1cn0 style_initial_gap_1__1rdq1cnc');
  });

  it('should return a class for a responsive variant that is called with a boolean', () => {
    const result = stack({ isDesktop: true });
    expect(result).toBe('style__1rdq1cn0 style_isDesktop_true__1rdq1cn5');

    const result1 = stack({ isDesktop: false });
    expect(result1).toBe('style__1rdq1cn0 style_isDesktop_false__1rdq1cn6');
  });

  it('should return a class for each condition in a responsive variant that is called with conditions', () => {
    const result = stack({ backgroundColor: { initial: 'green', md: 'blue', lg: 'green' } });
    expect(result).toBe(
      'style__1rdq1cn0 style_initial_backgroundColor_green__1rdq1cn9 style_md_backgroundColor_blue__1rdq1cnk style_lg_backgroundColor_green__1rdq1cnt'
    );

    const result1 = stack({ backgroundColor: { initial: 'green', md: 'blue' } });
    expect(result1).toBe(
      'style__1rdq1cn0 style_initial_backgroundColor_green__1rdq1cn9 style_md_backgroundColor_blue__1rdq1cnk'
    );

    const result2 = stack({ backgroundColor: { initial: 'green' } });
    expect(result2).toBe('style__1rdq1cn0 style_initial_backgroundColor_green__1rdq1cn9');
  });

  describe('should return the correct classes when', () => {
    it('multiple responsive variants are passed', () => {
      const result = stack({
        backgroundColor: { initial: 'green', md: 'blue', lg: 'green' },
        gap: { initial: 1, md: 2, lg: 3 },
      });
      expect(result).toBe(
        'style__1rdq1cn0 style_initial_backgroundColor_green__1rdq1cn9 style_md_backgroundColor_blue__1rdq1cnk style_lg_backgroundColor_green__1rdq1cnt style_initial_gap_1__1rdq1cnc style_md_gap_2__1rdq1cnn style_lg_gap_3__1rdq1cny'
      );
    });

    it('regular and responsive variants are passed', () => {
      const result = stack({
        size: 'small',
        backgroundColor: { initial: 'green', md: 'blue', lg: 'green' },
      });

      expect(result).toBe(
        'style__1rdq1cn0 style_size_small__1rdq1cn1 style_initial_backgroundColor_green__1rdq1cn9 style_md_backgroundColor_blue__1rdq1cnk style_lg_backgroundColor_green__1rdq1cnt style__compound_size_small_backgroundColor_blue_md__1rdq1cn16'
      );
    });

    it('responsive variants are passed with a primitive and conditions in the same call', () => {
      const result = stack({
        backgroundColor: 'green',
        gap: { initial: 1, md: 2, lg: 3 },
      });

      expect(result).toBe(
        'style__1rdq1cn0 style_initial_backgroundColor_green__1rdq1cn9 style_initial_gap_1__1rdq1cnc style_md_gap_2__1rdq1cnn style_lg_gap_3__1rdq1cny'
      );
    });

    it('a compound variant is passed with regular string variants', () => {
      const result = stack({ size: 'small', spacing: 'compact' });
      expect(result).toBe(
        'style__1rdq1cn0 style_size_small__1rdq1cn1 style_spacing_compact__1rdq1cn3 style__compound_size_small_spacing_compact__1rdq1cn1b'
      );
    });

    it('a compound variant is passed a regular boolean variant', () => {
      const result = stack({ isDesktop: false, spacing: 'compact' });
      expect(result).toBe(
        'style__1rdq1cn0 style_isDesktop_false__1rdq1cn6 style_spacing_compact__1rdq1cn3 style__compound_isDesktop_false_spacing_compact__1rdq1cn1c'
      );
    });

    it('a compound variant is passed a regular number variant', () => {
      const result = stack({ spacing: 'normal', amountOfCols: 12 });
      expect(result).toBe(
        'style__1rdq1cn0 style_spacing_normal__1rdq1cn4 style_amountOfCols_12__1rdq1cn8 style__compound_spacing_normal_amountOfCols_12__1rdq1cn1d'
      );
    });

    it('a compound variant is passed with responsive variants', () => {
      const result = stack({
        direction: { initial: 'column', md: 'row' },
        backgroundColor: { initial: 'green', md: 'blue', lg: 'green' },
      });

      expect(result).toBe(
        'style__1rdq1cn0 style_initial_direction_column__1rdq1cng style_md_direction_row__1rdq1cnp style_initial_backgroundColor_green__1rdq1cn9 style_md_backgroundColor_blue__1rdq1cnk style_lg_backgroundColor_green__1rdq1cnt style__compound_direction_row_backgroundColor_green_lg__1rdq1cn1g'
      );
    });

    it('a compound variant is passed with a responsive string variant', () => {
      const result = stack({
        size: 'small',
        backgroundColor: { initial: 'green', md: 'blue' },
      });

      expect(result).toBe(
        'style__1rdq1cn0 style_size_small__1rdq1cn1 style_initial_backgroundColor_green__1rdq1cn9 style_md_backgroundColor_blue__1rdq1cnk style__compound_size_small_backgroundColor_blue_md__1rdq1cn16'
      );
    });

    it('a compound variant is passed with a responsive boolean variant', () => {
      const result = stack({
        size: 'small',
        isFullHeight: false,
      });

      expect(result).toBe(
        'style__1rdq1cn0 style_size_small__1rdq1cn1 style_initial_isFullHeight_false__1rdq1cni style__compound_isFullHeight_false_size_small_initial__1rdq1cn1h'
      );
    });

    it('a compound variant is passed with a responsive number variant', () => {
      const result = stack({
        spacing: 'normal',
        gap: 1,
      });

      expect(result).toBe(
        'style__1rdq1cn0 style_spacing_normal__1rdq1cn4 style_initial_gap_1__1rdq1cnc style__compound_gap_1_spacing_normal_initial__1rdq1cn1k'
      );
    });

    it('a compound variant is passed with mixed responsive variants and regular variants', () => {
      const result = stack({
        size: 'small',
        direction: { initial: 'column', md: 'row' },
        backgroundColor: { initial: 'green', md: 'blue', lg: 'green' },
      });

      expect(result).toBe(
        'style__1rdq1cn0 style_size_small__1rdq1cn1 style_initial_direction_column__1rdq1cng style_md_direction_row__1rdq1cnp style_initial_backgroundColor_green__1rdq1cn9 style_md_backgroundColor_blue__1rdq1cnk style_lg_backgroundColor_green__1rdq1cnt style__compound_size_small_backgroundColor_blue_md__1rdq1cn16 style__compound_direction_row_backgroundColor_green_lg__1rdq1cn1g'
      );
    });

    it('should return the default variant for variants when no variant is passed', () => {
      const result = heading();
      expect(result).toBe(
        'style__1rdq1cn1n style_sm_size_large__1rdq1cn1r style_color_red__1rdq1cn1o'
      );
    });
  });
});
