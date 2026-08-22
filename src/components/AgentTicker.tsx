import { useEffect, useState } from 'react'

const LINES = [
  'agent: month-end close — done',
  'cash forecast updated',
  'reconciling ledgers…',
  'agent: invoices filed ✓',
  'agent: board report drafted',
  'runway recalculated',
  'agent: vendor SLAs reviewed ✓',
  'agent: bank feeds synced ✓',
  'variance analysis running…',
  'agent: VAT return prepared',
  'liquidity check — green',
  'agent: payroll preflight ✓',
  'fx exposure hedged',
  'agent: receivables chased',
  'burn rate updated',
  'agent: KPI dashboard refreshed',
  'scenario model rebuilt…',
  'agent: contracts indexed ✓',
  'working capital reviewed',
  'agent: budget draft v3 ready',
  'cap table reconciled',
  'agent: expense audit clean ✓',
  'cash sweep executed',
  'agent: supplier terms compared',
  'quarterly pack assembled…',
  'agent: data room updated ✓',
  'credit line utilization checked',
]

const HISTORY_SIZE = 3

export default function AgentTicker() {
  const [history, setHistory] = useState<string[]>([])
  const [text, setText] = useState('')

  useEffect(() => {
    let line = 0
    let char = 0
    let timer: number

    const tick = () => {
      const current = LINES[line]
      if (char <= current.length) {
        setText(current.slice(0, char))
        char++
        timer = window.setTimeout(tick, 45)
      } else {
        timer = window.setTimeout(() => {
          setHistory((h) => [...h, current].slice(-HISTORY_SIZE))
          setText('')
          char = 0
          line = (line + 1) % LINES.length
          tick()
        }, 2600)
      }
    }
    tick()
    return () => clearTimeout(timer)
  }, [])

  // Older lines fade with age; the line being typed is brightest.
  const opacityForAge = (indexFromEnd: number) => 0.55 - indexFromEnd * 0.15

  return (
    // Fixed width and height so the block never shifts as lines
    // type out or cycle; content is pinned to the bottom.
    <div className="font-mono text-xs sm:text-sm leading-relaxed text-left w-60 sm:w-72 h-20 sm:h-24 overflow-hidden flex flex-col justify-end">
      {history.map((line, i) => (
        <div
          key={`${line}-${i}`}
          className="text-primary whitespace-nowrap"
          style={{ opacity: opacityForAge(history.length - 1 - i) }}
        >
          <span className="opacity-60">›</span> {line}
        </div>
      ))}
      <div className="text-primary whitespace-nowrap" style={{ opacity: 0.85 }}>
        <span className="opacity-60">›</span> {text}
        <span className="inline-block w-[7px] h-3.5 ml-1 align-middle bg-primary/70 animate-pulse" />
      </div>
    </div>
  )
}
