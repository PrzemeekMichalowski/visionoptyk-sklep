// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
    // Opis karty pochodzi z Twojego admina Shopify, nie od użytkownika.
    'vue/no-v-html': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  ignores: ['.output/**', '.nuxt/**', 'dist/**'],
})
