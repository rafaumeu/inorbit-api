import { z } from 'zod'

import { createGoalCompletion } from '../../functions/create-goal-completion'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

export const createCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      schema: {
        description: 'Record a goal completion',
        tags: ['Goals'],
        body: z.object({
          goalId: z.string(),
        }),
        response: {
          201: z.object({
            goalCompletion: z.object({
              id: z.string(),
              goalId: z.string(),
              createdAt: z.string().datetime(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { goalId } = request.body
      const { goalCompletion } = await createGoalCompletion({
        goalId,
      })
      reply.status(201)
      return {
        goalCompletion: {
          id: goalCompletion.id,
          goalId: goalCompletion.goalId,
          createdAt: goalCompletion.createdAt.toISOString(),
        },
      }
    }
  )
}
