import { z } from 'zod'

import { getGoalStats } from '../../functions/get-goal-stats'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const getGoalStatsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/stats', {
    schema: {
      description: 'Get overall goal statistics including current week and top goals',
      tags: ['Analytics'],
      response: {
        200: z.object({
          stats: z.object({
            totalGoals: z.number(),
            totalCompletions: z.number(),
            currentWeek: z.object({
              completions: z.number(),
              desired: z.number(),
              completionRate: z.number(),
            }),
            topGoals: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                desiredWeeklyFrequency: z.number(),
                completionCount: z.number(),
              })
            ),
            averageCompletionsPerWeek: z.number(),
          }),
        }),
      },
    },
  }, async () => {
    const { stats } = await getGoalStats()
    return { stats }
  })
}
