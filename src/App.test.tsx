import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from './App'

describe('earnings calendar UI', () => {
  it('navigates months and returns to the current KST month', async () => {
    const user = userEvent.setup()
    render(<App today="2026-07-12" />)

    expect(screen.getByRole('heading', { name: '2026년 7월' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '다음 달' }))
    expect(screen.getByRole('heading', { name: '2026년 8월' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '오늘' }))
    expect(screen.getByRole('heading', { name: '2026년 7월' })).toBeInTheDocument()
  })

  it('selects an event date and exposes its official source', async () => {
    const user = userEvent.setup()
    render(<App today="2026-07-12" />)

    await user.click(screen.getByRole('button', { name: '삼성전자 2026년 2분기 실적발표' }))

    expect(screen.getByRole('heading', { name: '2026년 7월 30일 목' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '삼성전자 2026년 2분기 실적발표' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /삼성전자 공식 IR 일정/ })).toHaveAttribute(
      'href',
      'https://www.samsung.com/global/ir/ir-events-presentations/events/',
    )
  })

  it('filters a company from calendar and upcoming events', async () => {
    const user = userEvent.setup()
    render(<App today="2026-07-12" />)

    expect(screen.getByRole('button', { name: '삼성전자 2026년 2분기 실적발표' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '삼성전자 숨기기' }))

    expect(screen.queryByRole('button', { name: '삼성전자 2026년 2분기 실적발표' })).not.toBeInTheDocument()
    expect(screen.getAllByText('선택한 회사의 예정 일정이 없습니다.')).toHaveLength(2)
  })
})
