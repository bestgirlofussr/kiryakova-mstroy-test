import { defineConfig } from 'cypress'
import { register } from 'ts-node'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    async setupNodeEvents() {
      register({
        transpileOnly: true,
        project: './cypress/tsconfig.json',
      })
    },
  },
})