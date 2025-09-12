module.exports = {
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  testEnvironment: 'node',
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};