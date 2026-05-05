import fastify from 'fastify'

import fastifyCors from '@fastify/cors'
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

const app = fastify().withTypeProvider<ZodTypeProvider>()
app.register(fastifyCors, {
  origin: '*',
})
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
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
