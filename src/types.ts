export type Company = 'samsung' | 'sk-hynix'

export type EventType = 'preliminary' | 'final'

export interface EarningsEvent {
  id: string
  company: Company
  title: string
  fiscalPeriod: string
  date: string
  timeKst?: string
  type: EventType
  source: {
    label: string
    url: string
  }
}

export interface EarningsCalendarData {
  lastVerifiedAt: string
  events: EarningsEvent[]
}

export interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
}

export interface YearMonth {
  year: number
  month: number
}
