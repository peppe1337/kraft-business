import { motion } from 'framer-motion'
// import { ArrowRight } from 'lucide-react'
// import { WordsPullUp } from './WordsPullUp'
import MusicPlayer from './MusicPlayer'
import NameTag from './NameTag'
import AgentTicker from './AgentTicker'
import HeroScene from './HeroScene'

// const NAV_ITEMS = ['Our story', 'Collective', 'Workshops', 'Programs', 'Inquiries']

// const EASE = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  return (
    <section className="h-screen p-4 md:p-6">
      <div className="relative h-full w-full rounded-2xl md:rounded-[2rem] overflow-hidden">
        <HeroScene />
        <div className="noise-overlay absolute inset-0 opacity-[0.7] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

        <NameTag />

        {/* Agent status ticker, bottom right */}
        <motion.div
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <AgentTicker />
        </motion.div>

        <MusicPlayer />

        {/* Navbar — hidden for now
        <nav className="absolute top-0 left-1/2 -translate-x-1/2 bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8">
          <ul className="flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14">
            {NAV_ITEMS.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap transition-colors"
                  style={{ color: 'rgba(225, 224, 204, 0.8)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#E1E0CC')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(225, 224, 204, 0.8)')}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        */}

        {/* Hero content — hidden for now
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 md:px-10 pb-4 sm:pb-6 md:pb-8">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-12 lg:col-span-8">
              <WordsPullUp
                text="Prisma"
                showAsterisk
                className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] font-medium leading-[0.85] tracking-[-0.07em] text-[#E1E0CC]"
              />
            </div>
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 sm:gap-6 pb-2 sm:pb-4">
              <motion.p
                className="text-primary/70 text-xs sm:text-sm md:text-base max-w-md"
                style={{ lineHeight: 1.2 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: EASE }}
              >
                Prisma is a worldwide network of visual artists, filmmakers and storytellers
                bound not by place, status or labels but by passion and hunger to unlock
                potential through our unique perspectives.
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
              >
                <button className="group bg-primary rounded-full pl-5 pr-1.5 py-1.5 flex items-center gap-2 hover:gap-3 transition-all text-black font-medium text-sm sm:text-base">
                  Join the lab
                  <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#E1E0CC' }} />
                  </span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>
        */}
      </div>
    </section>
  )
}
