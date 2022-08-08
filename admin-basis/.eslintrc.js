// @ts-check
const { defineConfig } = require('eslint-define-config');
module.exports = defineConfig({
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    globals: {
        dayjs: 'readonly',
        $: 'readonly',
        $$: 'readonly',
        $ref: 'readonly',
        $computed: 'readonly',
        $shallowRef: 'readonly',
        $customRef: 'readonly',
        $toRef: 'readonly',
    },
    extends: ['plugin:vue/vue3-recommended', 'standard', './.eslintrc-auto-import.json', './.eslintrc-tz-global.json'],
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ['vue', '@typescript-eslint'],
    rules: {
        'no-var': 1, // 不使用var
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-undef': 'error',
        'no-empty': 'warn',
        'no-extra-semi': 2,
        'prefer-const': 1,
        'no-useless-escape': 'warn',
        semi: [2, 'always'],
        quotes: [
            'error',
            'double',
            {
                avoidEscape: true,
                allowTemplateLiterals: true
            },
        ],
        eqeqeq: 2,
        'comma-dangle': [
            'warn',
            {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'never',
                functions: 'never',
            }
        ],
        indent: 'off',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                argsIgnorePattern: '^_',
                args: 'after-used',
            }
        ],
        'vue/html-self-closing': 0,
        'vue/multi-word-component-names': 0,
        'vue/singleline-html-element-content-newline': 'off',
        'space-before-function-paren': [
            'error',
            {
                annymous: 'always',
                named: 'never',
                asyncArrow: 'always',
            }
        ],
        'vue/max-attributes-per-line': [
            'error',
            {
                singleline: 4,
                multiline: {
                    max: 4
                }
            }
        ],
        'vue/v-on-event-hyphenation': [
            'warn',
            'always',
            {
                autofix: true,
                ignore: []
            }
        ],
        'vue/html-indent': [
            'warn',
            2,
            {
                attribute: 1,
                baseIntent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                // @ts-ignore
                ignores: ['VAttribute']
            }
        ],
        'vue/first-attribute-linebreak': [
            'error',
            {
                singleline: 'ignore',
                multiline: 'ignore'
            }
        ]
    },
})