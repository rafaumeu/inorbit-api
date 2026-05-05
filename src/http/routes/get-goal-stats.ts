import type { FastifyPluginAsync } from 'fastify'
import { getGoalStats } from '../../functions/get-goal-stats'

export const getGoalStatsRoute: FastifyPluginAsync = async app => {
  app.get('/stats', async () => {
    const { stats } = await getGoalStats()
    return { stats }
  })
}
