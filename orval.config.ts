import { defineConfig } from 'orval'

export default defineConfig({
  'inorbit-api': {
    input: {
      target: 'http://localhost:3333/docs/json',
    },
    output: {
      target: './src/client/inorbit-client.ts',
      client: 'axios',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/client/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
