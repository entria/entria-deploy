const pkg = require('./package');

module.exports = {
  displayName: pkg.name,
  testPathIgnorePatterns: ['/node_modules/', './dist', './lib'],
  coverageReporters: ['lcov', 'html'],
  reporters: ['default', 'jest-junit'],
  transform: {
    '^.+\\.(js|ts|tsx)?$': 'babel-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(js|ts|tsx)?$',
  moduleFileExtensions: ['ts', 'js', 'tsx'],
};
