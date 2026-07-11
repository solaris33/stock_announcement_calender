import type { CalendarDay, YearMonth } from '../types'

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function parseYearMonth(date: string): YearMonth {
  if (!ISO_DATE_PATTERN.test(date)) {
    throw new Error(`올바르지 않은 ISO 날짜입니다: ${date}`)
  }

  return {
    year: Number(date.slice(0, 4)),
    month: Number(date.slice(5, 7)) - 1,
  }
}

export function todayInKst(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)

  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${value.year}-${value.month}-${value.day}`
}

export function addMonths(value: YearMonth, amount: number): YearMonth {
  const date = new Date(Date.UTC(value.year, value.month + amount, 1))
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() }
}

export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay()
  const gridStart = new Date(Date.UTC(year, month, 1 - firstWeekday))

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setUTCDate(gridStart.getUTCDate() + index)

    return {
      date: toIsoDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
      day: date.getUTCDate(),
      isCurrentMonth:
        date.getUTCFullYear() === year && date.getUTCMonth() === month,
    }
  })
}

export function formatMonthTitle(value: YearMonth): string {
  return `${value.year}년 ${value.month + 1}월`
}

export function formatKoreanDate(date: string, includeWeekday = true): string {
  const [year, month, day] = date.split('-').map(Number)
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeWeekday ? { weekday: 'short' } : {}),
  }).format(new Date(Date.UTC(year, month - 1, day, 12)))
}

export function getEventTiming(
  eventDate: string,
  today: string,
): 'past' | 'today' | 'upcoming' {
  if (eventDate < today) return 'past'
  if (eventDate > today) return 'upcoming'
  return 'today'
}
