import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// Native size of /hero-loop.mp4
const VIDEO_W = 2510
const VIDEO_H = 1440

// Anchor point in the video frame (fraction of width/height):
// just above the sitting person's head.
const ANCHOR_X = 0.557
const ANCHOR_Y = 0.522

export default function NameTag() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    // Map a point in the video frame to container coordinates under
    // object-cover (scale to fill, center, crop the overflow).
    const update = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const s = Math.max(w / VIDEO_W, h / VIDEO_H)
      const dw = VIDEO_W * s
      const dh = VIDEO_H * s
      setPos({
        left: ANCHOR_X * dw - (dw - w) / 2,
        top: ANCHOR_Y * dh - (dh - h) / 2,
      })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none">
      {pos && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: pos.left, top: pos.top }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{
              opacity: { delay: 0.8, duration: 1 },
              y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
            }}
          >
            <div className="flex flex-col items-center bg-black/60 backdrop-blur-md rounded-xl px-3 py-1.5 whitespace-nowrap">
              <div
                className="flex items-center gap-1.5 text-[10px] sm:text-xs"
                style={{ color: '#E1E0CC' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                Chris Kraft
              </div>
              <div className="text-[8px] sm:text-[9px] text-gray-400 tracking-wide">
                CFO &times; AI Operator
              </div>
            </div>

            <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-black/60 mt-[1px]" />
          </motion.div>
        </div>
      )}
    </div>
  )
}
