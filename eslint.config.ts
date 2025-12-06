import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import * as parserVue from 'vue-eslint-parser'
import configPrettier from '@vue/eslint-config-prettier'
import configTypeScript from '@vue/eslint-config-typescript'
import type { Linter } from 'eslint'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue,js,jsx}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
      '**/pnpm-lock.yaml',
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...configTypeScript(),
  configPrettier,
  {
    languageOptions: {
      parser: parserVue,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: configTypeScript.parser,
      },
    },
    rules: {
      // Vue 规则
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'warn',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always',
          },
        },
      ],

      // TypeScript 规则
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],

      // JavaScript 规则
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-unused-vars': 'off', // 使用 TypeScript 的规则
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
] satisfies Linter.Config[]