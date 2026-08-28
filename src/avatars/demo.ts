import { Avatar } from './types'

// Dev preview: append ?demoAvatars=1 to the URL to see the island
// populated with sample visitors (render-only, nothing is stored).
export function demoAvatars(): Avatar[] {
  const now = Date.now()
  const mk = (
    id: string,
    name: string,
    slot: number,
    pose: Avatar['pose'],
    skin: string,
    hair: string,
    shirt: string,
  ): Avatar => ({ id, name, slot, pose, palette: { skin, hair, shirt }, createdAt: now, lastSeenAt: now })

  return [
    mk('demo-1', 'Mira', 0, 'laptop', '#c98d6b', '#241408', '#5e6e89'),
    mk('demo-2', 'Jonas', 1, 'book', '#e0b48c', '#b59a72', '#a86a48'),
    mk('demo-3', '', 2, 'coffee', '#a97c5c', '#080904', '#7a6d22'),
    mk('demo-4', 'Ada', 4, 'zen', '#8a6244', '#6b4a2e', '#d8c4a5'),
    mk('demo-5', '', 5, 'laptop', '#e0b48c', '#7a3b24', '#41525e'),
    mk('demo-6', '', 6, 'book', '#c98d6b', '#241408', '#b8a06a'),
  ]
}

export function demoMode(): boolean {
  return new URLSearchParams(window.location.search).has('demoAvatars')
}
