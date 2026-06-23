import js from '@eslint/js'
import configPrettier from '@vue/eslint-config-prettier'
import configTypeScript from '@vue/eslint-config-typescript'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import pluginImportX from 'eslint-plugin-import-x'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue,js,jsx}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: [
      // 构建产物
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',

      // 依赖
      '**/node_modules/**',

      // 文档构建
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',

      // 锁文件
      '**/pnpm-lock.yaml',
      '**/package-lock.json',
      '**/yarn.lock',

      // 日志文件
      '**/*.log',

      // IDE 和系统文件
      '**/.vscode/**',
      '**/.idea/**',
      '**/.DS_Store',

      // 临时设计与参考文件
      '**/temp/**',

      // 其他
      '**/public/**',
      '**/.github/**',
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...configTypeScript(),
  configPrettier,
  {
    files: ['**/*.{ts,mts,tsx}'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      'import-x': pluginImportX,
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: './tsconfig.json',
          alwaysTryTypes: true,
        }),
      ],
    },
    rules: {
      // Import 顺序
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],

          pathGroups: [
            // Vue 生态
            {
              pattern: 'vue',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'vue-router',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'pinia',
              group: 'external',
              position: 'before',
            },

            // moe-ui 公开包
            {
              pattern: '@moe-ui/components',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@moe-ui/components/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@moe-ui/hooks',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@moe-ui/hooks/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@moe-ui/utils',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@moe-ui/utils/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@moe-ui/constants',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@moe-ui/constants/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@moe-ui/locale',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@moe-ui/locale/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@moe-ui/theme',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@moe-ui/theme/**',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@moe-ui/test-utils',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@moe-ui/test-utils/**',
              group: 'internal',
              position: 'after',
            },

            // 私有构建工具
            {
              pattern: '@moe-ui-private/**',
              group: 'internal',
              position: 'after',
            },
          ],

          pathGroupsExcludedImportTypes: ['builtin'],

          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import-x/no-duplicates': 'error',
      'import-x/newline-after-import': ['error', { count: 1 }],

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
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
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
]
