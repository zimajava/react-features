module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    createDefaultProgram: true,
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 12,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    // 'plugin:jest/all',
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:sonarjs/recommended',
  ],
  plugins: ['react', 'jsx-a11y', 'import', 'prettier', '@typescript-eslint', '@emotion'],
  globals: {
    fetch: true,
    window: true,
    document: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
        project: 'packages/*/tsconfig.json',
      },
      node: {
        extensions: [
          '.web.mjs',
          '.web.js',
          '.web.jsx',
          '.web.ts',
          '.web.tsx',
          '.mjs',
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
          '.native.js',
          '.native.jsx',
        ],
      },
    },
    react: {
      version: 'detect',
    },
    jest: {
      version: 'detect',
    },
    //   polyfills: ['Promise', 'fetch'],
  },
  rules: {
    // prettier
    'prettier/prettier': [
      'error',
      {
        bracketSpacing: true,
        bracketSameLine: false,
        jsxSingleQuote: false,
        printWidth: 120,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
        useTabs: false,
        endOfLine: 'lf',
      },
    ],
    // TypeScript
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-object-literal-type-assertion': 'off',
    // v4 changes
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    // React
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prop-types': ['off', {}],
    // import
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    // @emotion
    '@emotion/jsx-import': 'error',
    '@emotion/pkg-renaming': 'error',
    '@emotion/no-vanilla': 'error',
    '@emotion/import-from-emotion': 'error',
    '@emotion/styled-import': 'error',
    // https://github.com/facebook/react/tree/master/packages/eslint-plugin-react-hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',

    // CUSTOM
    '@typescript-eslint/ban-ts-comment': 'warn',
    'react/jsx-props-no-spreading': 'warn',

    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/sort-comp': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'sonarjs/no-duplicate-string': 'off',
  },
};
