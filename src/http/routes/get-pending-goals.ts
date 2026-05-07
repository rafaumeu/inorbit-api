import { z } from 'zod'

import { getWeekPendingGoals } from '../../functions/get-week-pending-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const getPendingRoute: FastifyPluginAsyncZod = async app => {
  app.get('/pending-goals', {
    schema: {
      description: 'Get pending goals for the current week',
      tags: ['Goals'],
      response: {
        200: z.object({
          pendingGoals: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              desiredWeeklyFrequency: z.number(),
              completionCount: z.number(),
            })
          ),
        }),
      },
    },
  }, async () => {
    const { pendingGoals } = await getWeekPendingGoals()
    return { pendingGoals }
  })
}
