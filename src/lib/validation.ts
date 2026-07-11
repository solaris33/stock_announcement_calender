import type { EarningsCalendarData } from '../types'

const ISO_DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/
const VALID_COMPANIES = new Set(['samsung', 'sk-hynix'])
const VALID_TYPES = new Set(['preliminary', 'final'])

function isRealDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  )
}

export function validateEarningsData(data: EarningsCalendarData): void {
  if (!isRealDate(data.lastVerifiedAt)) {
    throw new Error('lastVerifiedAt은 실제 ISO 날짜여야 합니다.')
  }

  const ids = new Set<string>()

  for (const event of data.events) {
    if (!event.id.trim() || ids.has(event.id)) {
      throw new Error(`이벤트 ID가 비어 있거나 중복되었습니다: ${event.id}`)
    }
    ids.add(event.id)

    if (!VALID_COMPANIES.has(event.company)) {
      throw new Error(`지원하지 않는 회사입니다: ${event.company}`)
    }
    if (!VALID_TYPES.has(event.type)) {
      throw new Error(`지원하지 않는 일정 유형입니다: ${event.type}`)
    }
    if (!isRealDate(event.date)) {
      throw new Error(`올바르지 않은 이벤트 날짜입니다: ${event.date}`)
    }
    if (event.timeKst && !TIME_PATTERN.test(event.timeKst)) {
      throw new Error(`올바르지 않은 KST 시간입니다: ${event.timeKst}`)
    }
    if (!event.title.trim() || !event.fiscalPeriod.trim()) {
      throw new Error(`이벤트 제목 또는 대상 분기가 비어 있습니다: ${event.id}`)
    }

    try {
      const sourceUrl = new URL(event.source.url)
      if (sourceUrl.protocol !== 'https:' || !event.source.label.trim()) {
        throw new Error('invalid source')
      }
    } catch {
      throw new Error(`올바르지 않은 공식 출처입니다: ${event.id}`)
    }
  }
}
