import { Avatar, EXPIRY_MS } from './types'

export interface AvatarBackend {
  /** All currently seated avatars (already pruned of expired ones). */
  list(): Promise<Avatar[]>
  /** Claim a seat. Resolves with the stored avatar, or null if the island is full. */
  join(avatar: Omit<Avatar, 'createdAt' | 'lastSeenAt'>): Promise<Avatar | null>
  /** Mark a returning visitor as seen (resets the 7-day expiry). */
  heartbeat(id: string): Promise<void>
  /** Give up the seat. */
  leave(id: string): Promise<void>
}

/**
 * Local mode: state lives in this browser's localStorage only, so you see
 * your own avatar but other visitors don't. The interface is identical to
 * a shared backend — point `backend` at an HttpBackend once one exists.
 */
class LocalBackend implements AvatarBackend {
  private KEY = 'island-avatars'

  private read(): Avatar[] {
    try {
      const raw = localStorage.getItem(this.KEY)
      const all: Avatar[] = raw ? JSON.parse(raw) : []
      const alive = all.filter((a) => Date.now() - a.lastSeenAt < EXPIRY_MS)
      if (alive.length !== all.length) this.write(alive)
      return alive
    } catch {
      return []
    }
  }

  private write(avatars: Avatar[]) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(avatars))
    } catch {
      // storage unavailable (private mode etc.) — feature degrades silently
    }
  }

  async list() {
    return this.read()
  }

  async join(avatar: Omit<Avatar, 'createdAt' | 'lastSeenAt'>) {
    const avatars = this.read()
    if (avatars.some((a) => a.slot === avatar.slot)) return null
    const stored: Avatar = { ...avatar, createdAt: Date.now(), lastSeenAt: Date.now() }
    this.write([...avatars, stored])
    return stored
  }

  async heartbeat(id: string) {
    const avatars = this.read()
    const mine = avatars.find((a) => a.id === id)
    if (mine) {
      mine.lastSeenAt = Date.now()
      this.write(avatars)
    }
  }

  async leave(id: string) {
    this.write(this.read().filter((a) => a.id !== id))
  }
}

/**
 * Shared mode, for when a real backend exists: expects a tiny REST API
 * (GET /avatars, POST /avatars, POST /avatars/:id/heartbeat,
 * DELETE /avatars/:id) that enforces the 7-day expiry server-side.
 */
class HttpBackend implements AvatarBackend {
  constructor(private baseUrl: string) {}

  async list() {
    const res = await fetch(`${this.baseUrl}/avatars`)
    if (!res.ok) return []
    return (await res.json()) as Avatar[]
  }

  async join(avatar: Omit<Avatar, 'createdAt' | 'lastSeenAt'>) {
    const res = await fetch(`${this.baseUrl}/avatars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(avatar),
    })
    if (!res.ok) return null
    return (await res.json()) as Avatar
  }

  async heartbeat(id: string) {
    await fetch(`${this.baseUrl}/avatars/${encodeURIComponent(id)}/heartbeat`, { method: 'POST' })
  }

  async leave(id: string) {
    await fetch(`${this.baseUrl}/avatars/${encodeURIComponent(id)}`, { method: 'DELETE' })
  }
}

// Flip to `new HttpBackend('https://api.example.com')` once a shared
// backend exists — nothing else in the app changes.
const AVATAR_API_URL: string | null = null

export const backend: AvatarBackend = AVATAR_API_URL
  ? new HttpBackend(AVATAR_API_URL)
  : new LocalBackend()

export const MY_AVATAR_KEY = 'island-my-avatar-id'
