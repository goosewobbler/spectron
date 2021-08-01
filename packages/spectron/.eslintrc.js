module.exports = {
  overrides: [
    {
      files: '*.ts',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: './tsconfig.json',
      },
      settings: {
        'import/resolver': {
          typescript: {
            project: [`${__dirname}/tsconfig.json`, `${__dirname}/../../common/tsconfig.json`],
            alwaysTryTypes: true,
          },
        },
      },
      rules: {
        'node/no-unpublished-import': 'error',
      },
    },
  ],
};
