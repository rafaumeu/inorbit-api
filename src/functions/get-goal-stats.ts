import dayjs from 'dayjs'
import { and, count, desc, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db'
import { goalCompletions, goals } from '../db/schema'

export async function getGoalStats() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  // Total goals and completions
  const [totalGoalsRow] = await db
    .select({ total: count(goals.id).mapWith(Number) })
    .from(goals)

  const [totalCompletionsRow] = await db
    .select({ total: count(goalCompletions.id).mapWith(Number) })
    .from(goalCompletions)

  // Goals created up to current week — CTE following existing codebase pattern
  const goalsUpToWeek = db.$with('goals_up_to_week').as(
    db
      .select({
        id: goals.id,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      })
      .from(goals)
      .where(lte(goals.createdAt, lastDayOfWeek))
  )

  // Completions grouped by goal for current week — CTE
  const completionsThisWeek = db.$with('completions_this_week').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id)
          .mapWith(Number)
          .as('completionCount'),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  // Current week desired frequency sum
  const [currentWeekDesiredRow] = await db
    .with(goalsUpToWeek)
    .select({
      desired:
        sql`COALESCE(SUM(${goalsUpToWeek.desiredWeeklyFrequency}), 0)`.mapWith(
          Number
        ),
    })
    .from(goalsUpToWeek)

  // Current week total completions
  const [currentWeekCompletionsRow] = await db
    .with(completionsThisWeek)
    .select({
      completions:
        sql`COALESCE(SUM(${completionsThisWeek.completionCount}), 0)`.mapWith(
          Number
        ),
    })
    .from(completionsThisWeek)

  const totalGoals = totalGoalsRow.total
  const totalCompletions = totalCompletionsRow.total
  const currentWeekDesired = currentWeekDesiredRow.desired
  const currentWeekCompletions = currentWeekCompletionsRow.completions
  const currentWeekRate =
    currentWeekDesired > 0
      ? Math.round((currentWeekCompletions / currentWeekDesired) * 100) / 100
      : 0

  // Top 5 most completed goals (all time) — CTE
  const allTimeCompletions = db.$with('all_time_completions').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id)
          .mapWith(Number)
          .as('completionCount'),
      })
      .from(goalCompletions)
      .groupBy(goalCompletions.goalId)
  )

  const topGoals = await db
    .with(allTimeCompletions)
    .select({
      id: goals.id,
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      completionCount:
        sql`COALESCE(${allTimeCompletions.completionCount}, 0)`.mapWith(Number),
    })
    .from(goals)
    .leftJoin(allTimeCompletions, eq(allTimeCompletions.goalId, goals.id))
    .orderBy(desc(sql`COALESCE(${allTimeCompletions.completionCount}, 0)`))
    .limit(5)

  // Average completions per week since first goal
  const [firstGoalRow] = await db
    .select({ createdAt: goals.createdAt })
    .from(goals)
    .orderBy(goals.createdAt)
    .limit(1)

  let averageCompletionsPerWeek = 0
  if (firstGoalRow) {
    const weeksSinceFirstGoal =
      dayjs().diff(dayjs(firstGoalRow.createdAt), 'week') + 1
    averageCompletionsPerWeek =
      weeksSinceFirstGoal > 0
        ? Math.round((totalCompletions / weeksSinceFirstGoal) * 100) / 100
        : 0
  }

  return {
    stats: {
      totalGoals,
      totalCompletions,
      currentWeek: {
        completions: currentWeekCompletions,
        desired: currentWeekDesired,
        completionRate: currentWeekRate,
      },
      topGoals,
      averageCompletionsPerWeek,
    },
  }
}
