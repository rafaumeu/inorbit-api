import { z } from 'zod'

import { createGoal } from '../../functions/create-goal'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const createGoalRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/goals',
    {
      schema: {
        description: 'Create a new goal',
        tags: ['Goals'],
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7),
        }),
        response: {
          201: z.object({
            goal: z.object({
              id: z.string(),
              title: z.string(),
              desiredWeeklyFrequency: z.number(),
              createdAt: z.string().datetime(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { title, desiredWeeklyFrequency } = request.body
      const { goal } = await createGoal({
        title,
        desiredWeeklyFrequency,
      })
      reply.status(201)
      return {
        goal: {
          id: goal.id,
          title: goal.title,
          desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
          createdAt: goal.createdAt.toISOString(),
        },
      }
    }
  )
}
