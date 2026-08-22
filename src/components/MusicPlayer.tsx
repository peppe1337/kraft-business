import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'

const TRACK_URL = '/lost-rupee-drift.mp3'
const TRACK_TITLE = 'Lost Rupee Drift'

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number>(0)
  const [playing, setPlaying] = useState(false)

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (!audioCtxRef.current) {
      const ctx = new AudioContext()
      const source = ctx.createMediaElementSource(audio)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      analyser.smoothingTimeConstant = 0.82
      source.connect(analyser)
      analyser.connect(ctx.destination)
      audioCtxRef.current = ctx
      analyserRef.current = analyser
    }
    await audioCtxRef.current.resume()

    if (audio.paused) {
      await audio.play()
      setPlaying(true)
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  useEffect(() => {
    if (!playing) return
    const canvas = canvasRef.current
    const analyser = analyserRef.current
    if (!canvas || !analyser) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const data = new Uint8Array(analyser.frequencyBinCount)
    const BINS = 96

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      analyser.getByteFrequencyData(data)

      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const mid = h / 2
      ctx.clearRect(0, 0, w, h)

      ctx.strokeStyle = '#E1E0CC'
      ctx.lineWidth = 1.5
      ctx.shadowColor = 'rgba(225, 224, 204, 0.9)'
      ctx.shadowBlur = 10

      // Symmetric waveform-style line built from the frequency spectrum,
      // mirrored around the horizontal center so peaks pulse outward.
      // Frequencies radiate from the middle: bass at the center of the
      // line, higher bins toward both edges.
      for (const dir of [1, -1]) {
        ctx.beginPath()
        ctx.moveTo(0, mid)
        for (let i = 0; i <= BINS; i++) {
          const x = (i / BINS) * w
          // 0 at the horizontal center, 1 at either edge
          const t = Math.abs(i - BINS / 2) / (BINS / 2)
          // ease t so the bass/mid range spreads wide around the center,
          // and skip the very top bins (mostly silence in music)
          const bin = Math.floor(Math.pow(t, 1.6) * data.length * 0.5)
          const v = data[bin] / 255
          const amp = v * v * (mid - 4)
          ctx.lineTo(x, mid - dir * amp)
        }
        ctx.lineTo(w, mid)
        ctx.stroke()
      }
    }
    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
    }
  }, [playing])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      audioCtxRef.current?.close()
    }
  }, [])

  return (
    <>
      <audio ref={audioRef} src={TRACK_URL} onEnded={() => setPlaying(false)} />

      {/* Sound line over the image, reacting to the music */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-x-0 bottom-24 sm:bottom-28 h-28 sm:h-36 w-full pointer-events-none transition-opacity duration-700 ${
          playing ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Player pill, bottom left */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-full pl-1.5 pr-4 py-1.5">
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className="bg-primary rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center transition-transform hover:scale-110"
        >
          {playing ? (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-black fill-black" />
          ) : (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 text-black fill-black translate-x-[1px]" />
          )}
        </button>
        <div className="flex flex-col">
          <span className="text-[10px] sm:text-xs" style={{ color: '#E1E0CC' }}>
            {TRACK_TITLE}
          </span>
          <span className="text-[9px] sm:text-[10px] text-gray-500">
            {playing ? 'Now playing' : 'Paused'}
          </span>
        </div>
      </div>
    </>
  )
}
