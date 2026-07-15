import type { EarningsCalendarData } from '../types'

const SAMSUNG_IR_URL =
  'https://www.samsung.com/global/ir/ir-events-presentations/events/'

export const earningsData: EarningsCalendarData = {
  lastVerifiedAt: '2026-07-16',
  events: [
    {
      id: 'samsung-2025-q4-preliminary',
      company: 'samsung',
      title: '삼성전자 2025년 4분기 잠정실적',
      fiscalPeriod: '2025년 4분기',
      date: '2026-01-08',
      type: 'preliminary',
      source: {
        label: '삼성전자 공식 IR 일정',
        url: SAMSUNG_IR_URL,
      },
    },
    {
      id: 'samsung-2025-q4-final',
      company: 'samsung',
      title: '삼성전자 2025년 4분기 실적발표',
      fiscalPeriod: '2025년 4분기',
      date: '2026-01-29',
      timeKst: '10:00',
      type: 'final',
      source: {
        label: '삼성전자 공식 IR 일정',
        url: SAMSUNG_IR_URL,
      },
    },
    {
      id: 'sk-hynix-2025-q4-final',
      company: 'sk-hynix',
      title: 'SK하이닉스 2025년 연간·4분기 실적발표',
      fiscalPeriod: '2025년 연간·4분기',
      date: '2026-01-28',
      type: 'final',
      source: {
        label: 'SK하이닉스 공식 뉴스룸',
        url: 'https://news.skhynix.co.kr/2025-business-results/',
      },
    },
    {
      id: 'samsung-2026-q1-preliminary',
      company: 'samsung',
      title: '삼성전자 2026년 1분기 잠정실적',
      fiscalPeriod: '2026년 1분기',
      date: '2026-04-07',
      type: 'preliminary',
      source: {
        label: '삼성전자 공식 IR 일정',
        url: SAMSUNG_IR_URL,
      },
    },
    {
      id: 'sk-hynix-2026-q1-final',
      company: 'sk-hynix',
      title: 'SK하이닉스 2026년 1분기 실적발표',
      fiscalPeriod: '2026년 1분기',
      date: '2026-04-23',
      type: 'final',
      source: {
        label: 'SK하이닉스 공식 뉴스룸',
        url: 'https://news.skhynix.co.kr/q1-2026-business-results/',
      },
    },
    {
      id: 'samsung-2026-q1-final',
      company: 'samsung',
      title: '삼성전자 2026년 1분기 실적발표',
      fiscalPeriod: '2026년 1분기',
      date: '2026-04-30',
      timeKst: '10:00',
      type: 'final',
      source: {
        label: '삼성전자 공식 IR 일정',
        url: SAMSUNG_IR_URL,
      },
    },
    {
      id: 'samsung-2026-q2-preliminary',
      company: 'samsung',
      title: '삼성전자 2026년 2분기 잠정실적',
      fiscalPeriod: '2026년 2분기',
      date: '2026-07-07',
      type: 'preliminary',
      source: {
        label: '삼성전자 공식 IR 일정',
        url: SAMSUNG_IR_URL,
      },
    },
    {
      id: 'sk-hynix-2026-q2-final',
      company: 'sk-hynix',
      title: 'SK하이닉스 2026년 2분기 실적발표',
      fiscalPeriod: '2026년 2분기',
      date: '2026-07-29',
      timeKst: '09:00',
      type: 'final',
      source: {
        label: 'SK하이닉스 공식 IR',
        url: 'https://www.skhynix.com/ir/UI-FR-IR01/',
      },
    },
    {
      id: 'samsung-2026-q2-final',
      company: 'samsung',
      title: '삼성전자 2026년 2분기 실적발표',
      fiscalPeriod: '2026년 2분기',
      date: '2026-07-30',
      timeKst: '10:00',
      type: 'final',
      source: {
        label: '삼성전자 공식 IR 일정',
        url: SAMSUNG_IR_URL,
      },
    },
  ],
}
