import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Armchair, X } from 'lucide-react'
import {
  Avatar,
  AvatarPose,
  POSES,
  SKIN_TONES,
  HAIR_COLORS,
  SHIRT_COLORS,
  SLOTS,
} from '../avatars/types'
import { backend, MY_AVATAR_KEY } from '../avatars/backend'

const POSE_LABELS: Record<AvatarPose, string> = {
  laptop: 'Laptop',
  book: 'Book',
  coffee: 'Coffee',
  zen: 'Zen',
}

export default function AvatarJoin({
  avatars,
  myId,
  onChange,
}: {
  avatars: Avatar[]
  myId: string | null
  onChange: () => void
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [pose, setPose] = useState<AvatarPose>('laptop')
  const [skin, setSkin] = useState(SKIN_TONES[1])
  const [hair, setHair] = useState(HAIR_COLORS[0])
  const [shirt, setShirt] = useState(SHIRT_COLORS[0])

  const seated = myId !== null && avatars.some((a) => a.id === myId)
  const freeSlots = SLOTS.map((_, i) => i).filter((i) => !avatars.some((a) => a.slot === i))
  const full = freeSlots.length === 0

  useEffect(() => {
    if (seated) setOpen(false)
  }, [seated])

  const join = async () => {
    const slot = freeSlots[Math.floor(Math.random() * freeSlots.length)]
    if (slot === undefined) return
    const id = crypto.randomUUID()
    const stored = await backend.join({
      id,
      name: name.trim().slice(0, 12),
      slot,
      pose,
      palette: { skin, hair, shirt },
    })
    if (stored) {
      try {
        localStorage.setItem(MY_AVATAR_KEY, id)
      } catch {
        /* ignore */
      }
      onChange()
    }
  }

  const leave = async () => {
    if (!myId) return
    await backend.leave(myId)
    try {
      localStorage.removeItem(MY_AVATAR_KEY)
    } catch {
      /* ignore */
    }
    onChange()
  }

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
      <AnimatePresence>
        {open && !seated && (
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-3 bg-black/70 backdrop-blur-md rounded-2xl p-4 w-[300px]"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: '#E1E0CC' }}>
                Take a seat on the island
              </span>
              <button aria-label="Close" onClick={() => setOpen(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={12}
              placeholder="Name (optional)"
              className="w-full bg-white/10 rounded-lg px-3 py-1.5 text-xs mb-3 outline-none placeholder-gray-500"
              style={{ color: '#E1E0CC' }}
            />

            <div className="flex gap-1.5 mb-3">
              {POSES.map((p) => (
                <button
                  key={p}
                  onClick={() => setPose(p)}
                  className={`flex-1 text-[10px] rounded-lg py-1.5 transition-colors ${
                    pose === p ? 'bg-primary text-black' : 'bg-white/10 text-gray-300'
                  }`}
                >
                  {POSE_LABELS[p]}
                </button>
              ))}
            </div>

            {(
              [
                ['Skin', SKIN_TONES, skin, setSkin],
                ['Hair', HAIR_COLORS, hair, setHair],
                ['Shirt', SHIRT_COLORS, shirt, setShirt],
              ] as const
            ).map(([label, options, value, set]) => (
              <div key={label} className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-gray-400 w-8">{label}</span>
                <div className="flex gap-1.5">
                  {options.map((c) => (
                    <button
                      key={c}
                      aria-label={`${label} ${c}`}
                      onClick={() => set(c)}
                      className={`w-5 h-5 rounded-full ${value === c ? 'ring-2 ring-white/80' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={join}
              className="w-full mt-2 bg-primary text-black text-xs font-medium rounded-full py-2 hover:opacity-90 transition-opacity"
            >
              Sit down
            </button>
            <p className="text-[9px] text-gray-500 mt-2 text-center">
              Your seat frees up if you don&apos;t visit for a week.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {seated ? (
        <button
          onClick={leave}
          className="bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 text-[10px] text-gray-400 hover:text-gray-200 transition-colors"
        >
          Leave your seat
        </button>
      ) : (
        <button
          onClick={() => setOpen((o) => !o)}
          disabled={full}
          className="flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-full pl-3 pr-4 py-1.5 text-xs transition-colors disabled:opacity-60"
          style={{ color: '#E1E0CC' }}
        >
          <Armchair className="w-4 h-4" />
          {full ? 'The island is full right now' : 'Take a seat'}
        </button>
      )}
    </div>
  )
}
