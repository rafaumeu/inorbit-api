import fastify from 'fastify'

import fastifyCors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { createCompletionRoute } from './routes/create-completion'
import { createGoalRoute } from './routes/create-goal'
import { getGoalStatsRoute } from './routes/get-goal-stats'
import { getPendingRoute } from './routes/get-pending-goals'
import { getWeekSummaryRoute } from './routes/get-week-summary'

import swaggerPlugin from '../plugins/swagger.js'

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.register(fastifyCors, {
  origin: '*',
})
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// Swagger must be registered BEFORE routes
app.register(swaggerPlugin)

// Health check endpoint
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

app.register(rateLimit, { max: 100, timeWindow: '1 minute' })

app.register(createGoalRoute)
app.register(createCompletionRoute)
app.register(getPendingRoute)
app.register(getWeekSummaryRoute)
app.register(getGoalStatsRoute)

app.listen({ port: Number(process.env.PORT) || 3333, host: '0.0.0.0' }).then(() => {
  console.log(`
    Server listening on port ${process.env.PORT || 3333}
  `)
})
