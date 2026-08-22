import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check, Bot, LineChart, Workflow } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { WordsPullUpMultiStyle } from './WordsPullUp'

const EASE = [0.22, 1, 0.36, 1] as const

interface ServiceCard {
  number: string
  title: string
  icon: LucideIcon
  items: string[]
}

const CARDS: ServiceCard[] = [
  {
    number: '01',
    title: 'Fractional CFO.',
    icon: LineChart,
    items: [
      'Controlling, reporting and cash planning',
      'Investor relations and documentation',
      'Public funding and bank financing',
    ],
  },
  {
    number: '02',
    title: 'Fractional COO.',
    icon: Workflow,
    items: [
      'Supply chain, import and compliance',
      'Retail, licensing and localisation operations',
      'Vendor and service-level governance',
    ],
  },
  {
    number: '03',
    title: 'AI-Agent Operations.',
    icon: Bot,
    items: [
      'Autonomous agents in production, not pilots',
      'Accounting and back-office automation',
      'Budgets, guardrails and kill criteria for agents',
    ],
  },
]

function CardShell({
  index,
  children,
  className = '',
}: {
  index: number
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay: index * 0.15, duration: 0.7, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export default function Services() {
  return (
    <section className="relative bg-black px-4 md:px-6 py-16 sm:py-20 md:py-28">
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <WordsPullUpMultiStyle
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal max-w-3xl mx-auto"
            segments={[
              {
                text: 'Consulting for finance, operations and AI-native execution.',
                className: 'text-primary',
              },
              {
                text: 'Scoped engagements. Hands-on delivery.',
                className: 'text-gray-500',
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-2 md:gap-1">
          {CARDS.map((card, i) => {
            const Icon = card.icon
            return (
              <CardShell
                key={card.number}
                index={i}
                className="bg-[#212121] rounded-2xl p-5 sm:p-6 flex flex-col min-h-[300px]"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-primary text-base sm:text-lg mt-4 sm:mt-5">
                  {card.title}{' '}
                  <span className="text-gray-500 text-xs align-super">({card.number})</span>
                </h3>
                <ul className="mt-4 sm:mt-5 space-y-3 flex-1">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-gray-400 text-xs sm:text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:chris@kraft.business"
                  className="group flex items-center gap-2 text-primary text-xs sm:text-sm mt-5 self-start"
                >
                  Get in touch
                  <ArrowRight className="w-4 h-4 -rotate-45 transition-transform group-hover:rotate-0" />
                </a>
              </CardShell>
            )
          })}
        </div>
      </div>
    </section>
  )
}
