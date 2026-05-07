import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

export default fp(async (app) => {
  app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'InOrbit API',
        description: 'REST API for goal tracking and weekly summaries',
        version: '1.0.0',
      },
    },
  })
  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: true },
    staticCSP: true,
  })
})
