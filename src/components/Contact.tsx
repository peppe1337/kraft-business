import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="bg-black px-4 md:px-6 pb-6 pt-10 sm:pt-16">
      <div
        ref={ref}
        className="bg-[#101010] rounded-2xl md:rounded-[2rem] max-w-6xl mx-auto text-center px-6 sm:px-10 py-14 sm:py-20"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-primary text-[10px] sm:text-xs mb-6 sm:mb-8">Contact</p>
          <h2 className="text-primary text-2xl sm:text-3xl md:text-4xl font-normal mb-8 sm:mb-10">
            Let&apos;s talk.
          </h2>
          <a
            href="mailto:chris@kraft.business"
            className="group inline-flex items-center gap-2 hover:gap-3 transition-all bg-primary rounded-full pl-5 pr-1.5 py-1.5 text-black font-medium text-sm sm:text-base"
          >
            chris@kraft.business
            <span className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform group-hover:scale-110">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#E1E0CC' }} />
            </span>
          </a>
        </motion.div>
      </div>

      <p className="text-center text-gray-600 text-[10px] sm:text-xs mt-8 pb-2">
        &copy; {new Date().getFullYear()} Chris Kraft
      </p>
    </section>
  )
}
