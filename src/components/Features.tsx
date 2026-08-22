import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { WordsPullUpMultiStyle } from './WordsPullUp'

const EASE = [0.22, 1, 0.36, 1] as const

interface FeatureCard {
  number: string
  title: string
  icon: string
  items: string[]
}

const CARDS: FeatureCard[] = [
  {
    number: '01',
    title: 'Project Storyboard.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
    items: [
      'Organize scenes and shots visually',
      'Drag-and-drop sequence editing',
      'Collaborative review and notes',
      'Version history for every frame',
    ],
  },
  {
    number: '02',
    title: 'Smart Critiques.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
    items: [
      'AI-powered analysis of every cut',
      'Creative notes from trusted peers',
      'Integrations with your favorite tools',
    ],
  },
  {
    number: '03',
    title: 'Immersion Capsule.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
    items: [
      'Silence notifications while you create',
      'Ambient soundscapes for deep focus',
      'Syncs with your creative schedule',
    ],
  },
]

function CardShell({ index, children, className = '' }: { index: number; children: React.ReactNode; className?: string }) {
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

export default function Features() {
  return (
    <section className="relative min-h-screen bg-black px-4 md:px-6 py-16 sm:py-20 md:py-28">
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <WordsPullUpMultiStyle
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal max-w-3xl mx-auto"
            segments={[
              {
                text: 'Studio-grade workflows for visionary creators.',
                className: 'text-primary',
              },
              {
                text: 'Built for pure vision. Powered by art.',
                className: 'text-gray-500',
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 lg:h-[480px]">
          {/* Card 1 — video */}
          <CardShell index={0} className="relative rounded-2xl overflow-hidden min-h-[320px] lg:min-h-0">
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <p
              className="absolute bottom-5 left-5 right-5 text-base sm:text-lg"
              style={{ color: '#E1E0CC' }}
            >
              Your creative canvas.
            </p>
          </CardShell>

          {/* Cards 2–4 */}
          {CARDS.map((card, i) => (
            <CardShell
              key={card.number}
              index={i + 1}
              className="bg-[#212121] rounded-2xl p-5 sm:p-6 flex flex-col min-h-[320px] lg:min-h-0"
            >
              <img
                src={card.icon}
                alt=""
                className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover"
              />
              <h3 className="text-primary text-base sm:text-lg mt-4 sm:mt-5">
                {card.title} <span className="text-gray-500 text-xs align-super">({card.number})</span>
              </h3>
              <ul className="mt-4 sm:mt-5 space-y-3 flex-1">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-gray-400 text-xs sm:text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="group flex items-center gap-2 text-primary text-xs sm:text-sm mt-5 self-start">
                Learn more
                <ArrowRight className="w-4 h-4 -rotate-45 transition-transform group-hover:rotate-0" />
              </button>
            </CardShell>
          ))}
        </div>
      </div>
    </section>
  )
}
