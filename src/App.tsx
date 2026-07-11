import { useMemo, useState } from 'react'
import { earningsData } from './data/earnings'
import {
  addMonths,
  buildMonthGrid,
  formatKoreanDate,
  formatMonthTitle,
  getEventTiming,
  parseYearMonth,
  todayInKst,
} from './lib/date'
import { validateEarningsData } from './lib/validation'
import type { Company, EarningsEvent, YearMonth } from './types'

validateEarningsData(earningsData)

const COMPANY_META: Record<
  Company,
  { name: string; shortName: string; className: string }
> = {
  samsung: {
    name: '삼성전자',
    shortName: '삼성',
    className: 'samsung',
  },
  'sk-hynix': {
    name: 'SK하이닉스',
    shortName: '하이닉스',
    className: 'sk-hynix',
  },
}

const TYPE_LABEL = {
  preliminary: '잠정실적',
  final: '확정실적',
} as const

const TIMING_LABEL = {
  past: '발표 완료',
  today: '오늘 발표',
  upcoming: '발표 예정',
} as const

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path
        d={direction === 'left' ? 'm12 5-5 5 5 5' : 'm8 5 5 5-5 5'}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <rect x="7" y="12.5" width="3" height="3" rx=".7" fill="currentColor" />
    </svg>
  )
}

function ArrowUpRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18">
      <path d="M5 13 13 5M7 5h6v6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  )
}

function EventChip({ event, onSelect }: { event: EarningsEvent; onSelect: () => void }) {
  const company = COMPANY_META[event.company]

  return (
    <button
      type="button"
      className={`event-chip ${company.className} ${event.type}`}
      aria-label={event.title}
      title={`${event.title} · ${TYPE_LABEL[event.type]}`}
      onClick={onSelect}
    >
      <span className="event-chip-dot" />
      <span className="event-company-full">{company.name}</span>
      <span className="event-company-short">{company.shortName}</span>
      <span className="event-type-short">{event.type === 'preliminary' ? '잠정' : '확정'}</span>
    </button>
  )
}

function EventDetail({ event, today }: { event: EarningsEvent; today: string }) {
  const company = COMPANY_META[event.company]
  const timing = getEventTiming(event.date, today)

  return (
    <article className="detail-card">
      <div className="detail-card-topline">
        <span className={`company-badge ${company.className}`}>{company.name}</span>
        <span className={`type-badge ${event.type}`}>{TYPE_LABEL[event.type]}</span>
        <span className={`timing-badge ${timing}`}>{TIMING_LABEL[timing]}</span>
      </div>
      <h3>{event.title}</h3>
      <dl className="detail-metadata">
        <div>
          <dt>대상 분기</dt>
          <dd>{event.fiscalPeriod}</dd>
        </div>
        <div>
          <dt>발표 일시</dt>
          <dd>
            {formatKoreanDate(event.date)}
            {event.timeKst ? ` ${event.timeKst} KST` : ' · 시간 미공개'}
          </dd>
        </div>
      </dl>
      <a className="source-link" href={event.source.url} target="_blank" rel="noreferrer">
        {event.source.label}
        <ArrowUpRightIcon />
      </a>
    </article>
  )
}

export function App({ today = todayInKst() }: { today?: string }) {
  const initialMonth = parseYearMonth(today)
  const [visibleMonth, setVisibleMonth] = useState<YearMonth>(initialMonth)
  const [selectedDate, setSelectedDate] = useState(today)
  const [visibleCompanies, setVisibleCompanies] = useState<Set<Company>>(
    () => new Set<Company>(['samsung', 'sk-hynix']),
  )

  const calendarDays = useMemo(
    () => buildMonthGrid(visibleMonth.year, visibleMonth.month),
    [visibleMonth],
  )

  const filteredEvents = useMemo(
    () =>
      earningsData.events
        .filter((event) => visibleCompanies.has(event.company))
        .sort((a, b) => a.date.localeCompare(b.date) || (a.timeKst ?? '').localeCompare(b.timeKst ?? '')),
    [visibleCompanies],
  )

  const eventsByDate = useMemo(() => {
    const result = new Map<string, EarningsEvent[]>()
    for (const event of filteredEvents) {
      result.set(event.date, [...(result.get(event.date) ?? []), event])
    }
    return result
  }, [filteredEvents])

  const selectedEvents = eventsByDate.get(selectedDate) ?? []
  const upcomingEvents = filteredEvents.filter((event) => event.date >= today)
  const nextEvent = upcomingEvents[0]

  function toggleCompany(company: Company) {
    setVisibleCompanies((current) => {
      const next = new Set(current)
      if (next.has(company)) next.delete(company)
      else next.add(company)
      return next
    })
  }

  function selectDate(date: string, isCurrentMonth: boolean) {
    setSelectedDate(date)
    if (!isCurrentMonth) setVisibleMonth(parseYearMonth(date))
  }

  function goToToday() {
    setVisibleMonth(initialMonth)
    setSelectedDate(today)
  }

  return (
    <div className="app-shell">
      <header className="site-header page-width">
        <a className="brand" href="./" aria-label="반도체 실적 캘린더 홈">
          <span className="brand-icon"><CalendarIcon /></span>
          <span>어닝 캘린더</span>
        </a>
        <span className="header-caption">KOSPI 반도체 대표주</span>
      </header>

      <main className="page-width">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero-copy">
            <p className="eyebrow">EARNINGS CALENDAR · 2026</p>
            <h1 id="page-title">놓치지 말아야 할<br />반도체 실적 발표일</h1>
            <p className="hero-description">
              삼성전자와 SK하이닉스의 공식 IR 일정을<br className="desktop-break" />
              한눈에 확인하세요.
            </p>
          </div>
          <aside className="next-event-card" aria-label="가장 가까운 발표 일정">
            <span className="next-event-label">
              <span className="live-dot" /> NEXT EARNINGS
            </span>
            {nextEvent ? (
              <>
                <div className="next-event-date">
                  <strong>{Number(nextEvent.date.slice(8, 10))}</strong>
                  <span>{Number(nextEvent.date.slice(5, 7))}월</span>
                </div>
                <div className="next-event-info">
                  <span className={`company-badge ${COMPANY_META[nextEvent.company].className}`}>
                    {COMPANY_META[nextEvent.company].name}
                  </span>
                  <h2>{nextEvent.fiscalPeriod} {TYPE_LABEL[nextEvent.type]}</h2>
                  <p>{nextEvent.timeKst ? `${nextEvent.timeKst} KST` : '발표 시간 미공개'}</p>
                </div>
              </>
            ) : (
              <p className="no-next-event">선택한 회사의 예정 일정이 없습니다.</p>
            )}
          </aside>
        </section>

        <section className="calendar-card" aria-labelledby="calendar-title">
          <div className="calendar-toolbar">
            <div className="month-navigation">
              <h2 id="calendar-title" aria-live="polite">{formatMonthTitle(visibleMonth)}</h2>
              <div className="nav-buttons">
                <button
                  type="button"
                  className="icon-button"
                  aria-label="이전 달"
                  onClick={() => setVisibleMonth((month) => addMonths(month, -1))}
                >
                  <ChevronIcon direction="left" />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="다음 달"
                  onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
                >
                  <ChevronIcon direction="right" />
                </button>
                <button type="button" className="today-button" onClick={goToToday}>오늘</button>
              </div>
            </div>

            <div className="filter-area" aria-label="일정 필터">
              <div className="company-filters">
                {(Object.keys(COMPANY_META) as Company[]).map((company) => {
                  const meta = COMPANY_META[company]
                  const isVisible = visibleCompanies.has(company)
                  return (
                    <button
                      key={company}
                      type="button"
                      className={`filter-button ${meta.className} ${isVisible ? 'active' : ''}`}
                      aria-pressed={isVisible}
                      aria-label={`${meta.name} ${isVisible ? '숨기기' : '표시하기'}`}
                      onClick={() => toggleCompany(company)}
                    >
                      <span className="filter-check" aria-hidden="true">{isVisible ? '✓' : ''}</span>
                      {meta.name}
                    </button>
                  )
                })}
              </div>
              <div className="type-legend" aria-label="일정 유형 범례">
                <span><i className="legend-dot preliminary" /> 잠정실적</span>
                <span><i className="legend-dot final" /> 확정실적</span>
              </div>
            </div>
          </div>

          <div className="calendar" role="grid" aria-label={`${formatMonthTitle(visibleMonth)} 실적발표 캘린더`}>
            <div className="weekday-row" role="row">
              {WEEKDAYS.map((weekday, index) => (
                <div
                  key={weekday}
                  className={`weekday ${index === 0 ? 'sunday' : ''} ${index === 6 ? 'saturday' : ''}`}
                  role="columnheader"
                >
                  {weekday}
                </div>
              ))}
            </div>
            <div className="day-grid" role="rowgroup">
              {calendarDays.map((day, index) => {
                const events = eventsByDate.get(day.date) ?? []
                const isToday = day.date === today
                const isSelected = day.date === selectedDate
                const weekday = index % 7
                return (
                  <div
                    key={day.date}
                    className={[
                      'day-cell',
                      !day.isCurrentMonth ? 'outside-month' : '',
                      isToday ? 'today' : '',
                      isSelected ? 'selected' : '',
                    ].filter(Boolean).join(' ')}
                    role="gridcell"
                    aria-selected={isSelected}
                  >
                    <button
                      type="button"
                      className={`date-button ${weekday === 0 ? 'sunday' : ''} ${weekday === 6 ? 'saturday' : ''}`}
                      aria-label={`${formatKoreanDate(day.date)} 선택`}
                      onClick={() => selectDate(day.date, day.isCurrentMonth)}
                    >
                      <span>{day.day}</span>
                      {isToday && <small>오늘</small>}
                    </button>
                    <div className="day-events">
                      {events.map((event) => (
                        <EventChip
                          key={event.id}
                          event={event}
                          onSelect={() => setSelectedDate(event.date)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="information-grid" aria-label="일정 상세 정보">
          <div className="panel detail-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">SELECTED DATE</p>
                <h2>{formatKoreanDate(selectedDate)}</h2>
              </div>
              <span className="event-count">{selectedEvents.length}개 일정</span>
            </div>
            <div className="detail-list">
              {selectedEvents.length ? (
                selectedEvents.map((event) => <EventDetail key={event.id} event={event} today={today} />)
              ) : (
                <div className="empty-state">
                  <span className="empty-icon"><CalendarIcon /></span>
                  <h3>등록된 발표 일정이 없어요</h3>
                  <p>공식 일정이 확인되면 이곳에 업데이트됩니다.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="panel upcoming-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">UPCOMING</p>
                <h2>다가오는 일정</h2>
              </div>
              <span className="event-count">KST</span>
            </div>
            <div className="upcoming-list">
              {upcomingEvents.length ? upcomingEvents.map((event) => {
                const company = COMPANY_META[event.company]
                const timing = getEventTiming(event.date, today)
                return (
                  <button
                    type="button"
                    className="upcoming-item"
                    key={event.id}
                    onClick={() => {
                      setSelectedDate(event.date)
                      setVisibleMonth(parseYearMonth(event.date))
                    }}
                  >
                    <span className="upcoming-date">
                      <strong>{Number(event.date.slice(8, 10))}</strong>
                      <small>{Number(event.date.slice(5, 7))}월</small>
                    </span>
                    <span className="upcoming-copy">
                      <span className="upcoming-meta">
                        <i className={`company-dot ${company.className}`} />
                        {company.name} · {TYPE_LABEL[event.type]}
                      </span>
                      <strong>{event.fiscalPeriod} 실적발표</strong>
                      <small>{event.timeKst ? `${event.timeKst} KST` : '시간 미공개'}</small>
                    </span>
                    <span className={`upcoming-status ${timing}`}>{TIMING_LABEL[timing]}</span>
                  </button>
                )
              }) : (
                <div className="upcoming-empty">선택한 회사의 예정 일정이 없습니다.</div>
              )}
            </div>
          </aside>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width footer-inner">
          <div>
            <strong>어닝 캘린더</strong>
            <p>데이터 최종 확인 {formatKoreanDate(earningsData.lastVerifiedAt, false)}</p>
          </div>
          <p className="disclaimer">
            본 서비스는 공식 IR 자료를 정리한 참고용 정보이며 투자 제안이나 종목 추천이 아닙니다.<br />
            일정은 변경될 수 있으므로 투자 판단 전 각 회사의 공식 출처를 확인해 주세요.
          </p>
        </div>
      </footer>
    </div>
  )
}
