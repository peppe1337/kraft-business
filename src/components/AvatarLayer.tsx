import { Avatar, SLOTS } from '../avatars/types'

/**
 * Renders visitor avatars seated on the island, inside the same
 * 2510x1440 "slice" coordinate space as the hero video, so they stay
 * glued to their spots at every viewport size. Sits between the video
 * and the film-grain overlay, so the grain textures the avatars too.
 */

function SeatedFigure({ avatar }: { avatar: Avatar }) {
  const { pose, palette } = avatar
  const { skin, hair, shirt } = palette

  // Drawn in a local coordinate space: seat at (0,0), figure extends up.
  // Roughly half the scale of the scene's main character.
  return (
    <>
      {/* soft ground shadow */}
      <ellipse cx="6" cy="4" rx="64" ry="14" fill="#2a1d10" opacity="0.35" />
      {/* crossed legs */}
      <path d="M -52 2 Q -40 -26 0 -24 Q 44 -26 54 0 Q 30 12 0 10 Q -32 12 -52 2 Z" fill="#2a2118" />
      {/* torso */}
      <path
        d="M -34 -18 Q -40 -78 -12 -96 Q 8 -104 24 -92 Q 40 -76 34 -18 Q 8 -6 -34 -18 Z"
        fill={shirt}
      />
      {/* torso core shadow (light from upper right) */}
      <path d="M -34 -18 Q -40 -78 -12 -96 Q -20 -60 -16 -20 Q -26 -14 -34 -18 Z" fill="#000" opacity="0.22" />
      {/* torso lit rim, light from upper right */}
      <path d="M 24 -92 Q 40 -76 34 -18 Q 28 -16 24 -16 Q 30 -70 18 -88 Z" fill="#fff" opacity="0.16" />
      {/* head */}
      <ellipse cx="4" cy="-110" rx="19" ry="21" fill={skin} />
      {/* hair: full cap wrapping top, back and sides */}
      <path
        d="M -16 -104 Q -24 -134 2 -138 Q 26 -136 22 -106 Q 22 -96 18 -92 L 14 -96 Q 20 -114 8 -122 Q -6 -126 -12 -112 Q -14 -102 -12 -96 L -16 -94 Q -19 -98 -16 -104 Z"
        fill={hair}
      />
      <path d="M -16 -104 Q -22 -132 2 -137 Q 24 -135 21 -108 Q 12 -128 0 -127 Q -12 -124 -16 -104 Z" fill={hair} />

      {pose === 'laptop' && (
        <g>
          <path d="M 20 -46 L 62 -42 L 58 -20 L 18 -26 Z" fill="#3c4a66" />
          <path d="M 24 -84 L 60 -80 L 62 -44 L 22 -48 Z" fill="#1c222e" />
          <path d="M 27 -80 L 57 -76 L 58 -48 L 26 -52 Z" fill="#c9ccb8" />
          {/* arm to the keys */}
          <path d="M 26 -66 Q 40 -50 30 -34 L 20 -38 Q 26 -52 18 -62 Z" fill={shirt} />
          <ellipse cx="30" cy="-32" rx="7" ry="5" fill={skin} />
        </g>
      )}
      {pose === 'book' && (
        <g>
          <path d="M 14 -50 L 40 -62 L 44 -34 L 18 -26 Z" fill="#d8cdb2" />
          <path d="M 40 -62 L 66 -54 L 66 -28 L 44 -34 Z" fill="#c4b795" />
          <path d="M 38 -64 L 42 -32" stroke="#6b5a3a" strokeWidth="3" fill="none" />
          <path d="M 20 -64 Q 30 -52 20 -40 L 12 -46 Q 18 -54 12 -60 Z" fill={shirt} />
          <ellipse cx="20" cy="-38" rx="6" ry="5" fill={skin} />
        </g>
      )}
      {pose === 'coffee' && (
        <g>
          <path d="M 24 -66 Q 42 -60 38 -44 L 28 -46 Q 30 -56 20 -58 Z" fill={shirt} />
          <ellipse cx="34" cy="-44" rx="6" ry="5" fill={skin} />
          <path d="M 28 -56 L 44 -54 L 42 -38 L 30 -40 Z" fill="#d8c4a5" />
          <path d="M 44 -52 Q 52 -50 44 -42" stroke="#d8c4a5" strokeWidth="3" fill="none" />
          {/* steam */}
          <path d="M 34 -60 Q 38 -68 34 -74" stroke="#f0e6d4" strokeWidth="2.5" fill="none" opacity="0.5" />
        </g>
      )}
      {pose === 'zen' && (
        <g>
          {/* arms resting outward onto the knees */}
          <path d="M -26 -66 Q -42 -50 -36 -28 L -28 -32 Q -32 -48 -20 -60 Z" fill={shirt} />
          <path d="M 30 -66 Q 46 -50 40 -28 L 32 -32 Q 36 -48 24 -60 Z" fill={shirt} />
          <ellipse cx="-34" cy="-26" rx="8" ry="6" fill={skin} />
          <ellipse cx="38" cy="-26" rx="8" ry="6" fill={skin} />
        </g>
      )}
    </>
  )
}

export default function AvatarLayer({ avatars, myId }: { avatars: Avatar[]; myId: string | null }) {
  return (
    <svg
      viewBox="0 0 2510 1440"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full pointer-events-none"
    >
      {avatars.map((a) => {
        const slot = SLOTS[a.slot]
        if (!slot) return null
        const s = slot.scale * 1.9 * (slot.flip ? -1 : 1)
        return (
          <g key={a.id} className="avatar-bob" style={{ animationDelay: `${(a.slot % 5) * 0.7}s` }}>
            <g transform={`translate(${slot.x} ${slot.y}) scale(${s} ${Math.abs(s)})`}>
              <SeatedFigure avatar={a} />
            </g>
            {a.name && (
              <g transform={`translate(${slot.x} ${slot.y - Math.abs(s) * 155})`}>
                <rect
                  x={-a.name.length * 11 - 14}
                  y="-38"
                  width={a.name.length * 22 + 28}
                  height="44"
                  rx="22"
                  fill="#000"
                  opacity="0.55"
                />
                <text
                  x="0"
                  y="-6"
                  textAnchor="middle"
                  fontSize="30"
                  fill={a.id === myId ? '#9ae6a0' : '#E1E0CC'}
                  style={{ fontFamily: 'Almarai, sans-serif' }}
                >
                  {a.name}
                </text>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
