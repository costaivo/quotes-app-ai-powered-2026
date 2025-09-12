module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // allow longer commit headers and bodies; keep conventional commits but relax line limits
    'header-max-length': [2, 'always', 200],
    'body-max-line-length': [2, 'always', 1000]
  }
};
