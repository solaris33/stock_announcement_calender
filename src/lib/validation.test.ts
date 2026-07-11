import { earningsData } from '../data/earnings'
import type { EarningsCalendarData } from '../types'
import { validateEarningsData } from './validation'

describe('earnings data validation', () => {
  it('accepts the production data', () => {
    expect(() => validateEarningsData(earningsData)).not.toThrow()
  })

  it('rejects duplicate event ids', () => {
    const invalid: EarningsCalendarData = {
      ...earningsData,
      events: [earningsData.events[0], { ...earningsData.events[1], id: earningsData.events[0].id }],
    }

    expect(() => validateEarningsData(invalid)).toThrow(/중복/)
  })

  it('rejects impossible dates and non-HTTPS sources', () => {
    const invalidDate: EarningsCalendarData = {
      ...earningsData,
      events: [{ ...earningsData.events[0], date: '2026-02-30' }],
    }
    const invalidSource: EarningsCalendarData = {
      ...earningsData,
      events: [
        {
          ...earningsData.events[0],
          source: { label: '공식 출처', url: 'http://example.com' },
        },
      ],
    }

    expect(() => validateEarningsData(invalidDate)).toThrow(/날짜/)
    expect(() => validateEarningsData(invalidSource)).toThrow(/출처/)
  })
})
