import { expect, describe, it } from 'vitest';
import { stack } from './responsive-recipes.css';

describe('responsive recipes', () => {
  it('should generate a class name without any config', () => {
    expect(stack()).toBe('responsive-recipes__ublbf0');
  });

  it('should generate a class name with a regular variant', () => {
    expect(stack({ size: 'small' })).toBe('responsive-recipes__ublbf0 responsive-recipes__ublbf1');
  });
});
