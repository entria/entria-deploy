const pkg = require('./package');

module.exports = {
  displayName: pkg.name,
  testPathIgnorePatterns: ['/node_modules/', './dist', './lib'],
  coverageReporters: ['lcov', 'html'],
  reporters: ['default', 'jest-junit'],
  transform: {
    '^.+\\.(js|ts|tsx)?$': '<rootDir>/test/babel-transformer',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts|tsx)?$',
  moduleFileExtensions: ['ts', 'js', 'tsx'],
};
