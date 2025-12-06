import js from '@eslint/js'
import configPrettier from '@vue/eslint-config-prettier'
import configTypeScript from '@vue/eslint-config-typescript'
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

      // 临时文件
      '**/*.local',
      '**/*.suo',
      '**/*.ntvs*',
      '**/*.njsproj',
      '**/*.sln',
      '**/*.sw?',

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
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
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
      '@typescript-eslint/no-explicit-any': 'off',
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
]
