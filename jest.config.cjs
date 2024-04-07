module.exports = {
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$',
  transform: {
    '\\.css\\.ts$': '@vanilla-extract/jest-transform',
    '.(ts|tsx)': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};
