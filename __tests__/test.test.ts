import { stack } from '../styles.css';

describe('recipes', () => {
  it('should generate a class name without any config', () => {
    expect(stack({})).toBe('styles__7pcx4y0');
  });

  it('should generate a class name with a regular variant', () => {
    expect(stack({ size: 'small' })).toBe('styles__7pcx4y0 styles__7pcx4y1');
  });
});
