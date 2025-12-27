module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // ميزة جديدة
        'fix',      // إصلاح خطأ
        'docs',     // توثيق
        'style',    // تنسيق
        'refactor', // إعادة هيكلة
        'test',     // اختبارات
        'chore',    // مهام صيانة
        'ci',       // CI/CD
        'perf',     // تحسين أداء
        'revert',   // تراجع
      ],
    ],
    'subject-case': [0],
  },
};
