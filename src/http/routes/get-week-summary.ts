import { z } from 'zod'

import { getWeekSummary } from '../../functions/get-week-summary'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get('/summary', {
    schema: {
      description: 'Get the current week summary with completions per day',
      tags: ['Analytics'],
      response: {
        200: z.object({
          summary: z.object({
            complete: z.number(),
            total: z.number(),
            goalsPerDay: z.record(
              z.string(),
              z.array(
                z.object({
                  id: z.string(),
                  title: z.string(),
                  completedAt: z.string(),
                })
              )
            ),
          }),
        }),
      },
    },
  }, async () => {
    const { summary } = await getWeekSummary()
    return { summary }
  })
}
