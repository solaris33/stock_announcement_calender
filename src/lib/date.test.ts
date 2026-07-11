import { addMonths, buildMonthGrid, getEventTiming, todayInKst } from './date'

describe('calendar date utilities', () => {
  it('starts a month grid on Sunday and always returns six weeks', () => {
    const grid = buildMonthGrid(2026, 6)

    expect(grid).toHaveLength(42)
    expect(grid[0]).toEqual({ date: '2026-06-28', day: 28, isCurrentMonth: false })
    expect(grid[41]).toEqual({ date: '2026-08-08', day: 8, isCurrentMonth: false })
  })

  it('includes leap day as a current-month date', () => {
    const grid = buildMonthGrid(2024, 1)
    expect(grid).toContainEqual({ date: '2024-02-29', day: 29, isCurrentMonth: true })
  })

  it('moves across year boundaries', () => {
    expect(addMonths({ year: 2026, month: 0 }, -1)).toEqual({ year: 2025, month: 11 })
    expect(addMonths({ year: 2026, month: 11 }, 1)).toEqual({ year: 2027, month: 0 })
  })

  it('calculates the date in Korea Standard Time', () => {
    expect(todayInKst(new Date('2026-07-11T15:30:00Z'))).toBe('2026-07-12')
  })

  it('classifies past, today, and upcoming events', () => {
    expect(getEventTiming('2026-07-11', '2026-07-12')).toBe('past')
    expect(getEventTiming('2026-07-12', '2026-07-12')).toBe('today')
    expect(getEventTiming('2026-07-13', '2026-07-12')).toBe('upcoming')
  })
})
