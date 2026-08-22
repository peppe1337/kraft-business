import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { WordsPullUpMultiStyle } from './WordsPullUp'

const BODY_TEXT =
  'Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals.'

function AnimatedLetter({
  char,
  index,
  totalChars,
  progress,
}: {
  char: string
  index: number
  totalChars: number
  progress: MotionValue<number>
}) {
  const charProgress = index / totalChars
  const opacity = useTransform(progress, [charProgress - 0.1, charProgress + 0.05], [0.2, 1])

  return <motion.span style={{ opacity }}>{char}</motion.span>
}

export default function About() {
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: bodyRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const chars = BODY_TEXT.split('')

  return (
    <section className="bg-black px-4 md:px-6 py-4 md:py-6">
      <div className="bg-[#101010] rounded-2xl md:rounded-[2rem] max-w-6xl mx-auto text-center px-6 sm:px-10 md:px-16 py-16 sm:py-20 md:py-28">
        <p className="text-primary text-[10px] sm:text-xs mb-8 sm:mb-12">Visual arts</p>

        <WordsPullUpMultiStyle
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9] gap-x-[0.25em]"
          segments={[
            { text: 'I am Marcus Chen,', className: 'font-normal text-primary' },
            { text: 'a self-taught director.', className: 'italic font-serif text-primary' },
            {
              text: 'I have skills in color grading, visual effects, and narrative design.',
              className: 'font-normal text-primary',
            },
          ]}
        />

        <p
          ref={bodyRef}
          className="text-[#DEDBC8] text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-10 sm:mt-14 leading-relaxed"
        >
          {chars.map((char, i) => (
            <AnimatedLetter
              key={i}
              char={char}
              index={i}
              totalChars={chars.length}
              progress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </section>
  )
}
