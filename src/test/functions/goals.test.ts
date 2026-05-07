import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockDb = {
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn(),
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  $with: vi.fn().mockReturnThis(),
  with: vi.fn().mockReturnThis(),
  leftJoin: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
  groupBy: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn(),
  as: vi.fn().mockReturnThis(),
}

vi.mock('../../db', () => ({ db: mockDb }))

describe('create-goal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.insert.mockReturnThis()
    mockDb.values.mockReturnThis()
    mockDb.returning.mockReset()
  })

  it('should create a goal with valid data', async () => {
    const fakeGoal = {
      id: 'abc123',
      title: 'Read a book',
      desiredWeeklyFrequency: 3,
      createdAt: new Date('2024-01-01'),
    }
    mockDb.returning.mockResolvedValue([fakeGoal])

    const { createGoal } = await import('../../functions/create-goal')
    const result = await createGoal({
      title: 'Read a book',
      desiredWeeklyFrequency: 3,
    })

    expect(result.goal).toEqual(fakeGoal)
    expect(mockDb.insert).toHaveBeenCalled()
    expect(mockDb.values).toHaveBeenCalledWith({
      title: 'Read a book',
      desiredWeeklyFrequency: 3,
    })
  })

  it('should create a goal with frequency 1', async () => {
    const fakeGoal = {
      id: 'def456',
      title: 'Exercise',
      desiredWeeklyFrequency: 1,
      createdAt: new Date('2024-01-02'),
    }
    mockDb.returning.mockResolvedValue([fakeGoal])

    const { createGoal } = await import('../../functions/create-goal')
    const result = await createGoal({
      title: 'Exercise',
      desiredWeeklyFrequency: 1,
    })

    expect(result.goal.desiredWeeklyFrequency).toBe(1)
  })

  it('should create a goal with frequency 7 (daily)', async () => {
    const fakeGoal = {
      id: 'ghi789',
      title: 'Meditate',
      desiredWeeklyFrequency: 7,
      createdAt: new Date('2024-01-03'),
    }
    mockDb.returning.mockResolvedValue([fakeGoal])

    const { createGoal } = await import('../../functions/create-goal')
    const result = await createGoal({
      title: 'Meditate',
      desiredWeeklyFrequency: 7,
    })

    expect(result.goal.desiredWeeklyFrequency).toBe(7)
  })
})

describe('create-goal-completion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockDb.limit.mockReset()
    mockDb.returning.mockReset()
    mockDb.insert.mockReturnThis()
    mockDb.values.mockReturnThis()
  })

  it('should create a completion when goal not yet completed this week', async () => {
    mockDb.limit.mockResolvedValueOnce([
      { desiredWeeklyFrequency: 3, completionCount: 2 },
    ])
    mockDb.returning.mockResolvedValue([
      { id: 'comp1', goalId: 'goal1', createdAt: new Date('2024-01-01') },
    ])

    const { createGoalCompletion } = await import('../../functions/create-goal-completion')
    const result = await createGoalCompletion({ goalId: 'goal1' })

    expect(result.goalCompletion.goalId).toBe('goal1')
  })

  it('should throw when goal already completed desired frequency', async () => {
    mockDb.limit.mockResolvedValueOnce([
      { desiredWeeklyFrequency: 3, completionCount: 3 },
    ])

    const { createGoalCompletion } = await import('../../functions/create-goal-completion')
    await expect(
      createGoalCompletion({ goalId: 'goal1' })
    ).rejects.toThrow('Goal already completed')
  })

  it('should throw when goal completed more than desired frequency', async () => {
    mockDb.limit.mockResolvedValueOnce([
      { desiredWeeklyFrequency: 1, completionCount: 5 },
    ])

    const { createGoalCompletion } = await import('../../functions/create-goal-completion')
    await expect(
      createGoalCompletion({ goalId: 'goal1' })
    ).rejects.toThrow('Goal already completed')
  })
})
