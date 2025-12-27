module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // New feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Formatting
        'refactor', // Refactoring
        'test',     // Tests
        'chore',    // Maintenance tasks
        'ci',       // CI/CD
        'perf',     // Performance improvement
        'revert',   // Revert changes
      ],
    ],
    'subject-case': [0],
  },
};
