export type AvatarPose = 'laptop' | 'book' | 'coffee' | 'zen'

export interface AvatarPalette {
  skin: string
  hair: string
  shirt: string
}

export interface Avatar {
  id: string
  name: string
  slot: number
  pose: AvatarPose
  palette: AvatarPalette
  createdAt: number
  lastSeenAt: number
}

// Scene-consistent choices (sampled from the hero video's palette)
export const SKIN_TONES = ['#e0b48c', '#c98d6b', '#a97c5c', '#8a6244']
export const HAIR_COLORS = ['#241408', '#080904', '#6b4a2e', '#b59a72', '#7a3b24']
export const SHIRT_COLORS = ['#b8a06a', '#5e6e89', '#a86a48', '#7a6d22', '#d8c4a5', '#41525e']
export const POSES: AvatarPose[] = ['laptop', 'book', 'coffee', 'zen']

// Sitting spots on the island, in the hero video's 2510x1440 coordinate
// space: [x, y] is where the avatar's seat touches the ground, scale
// shrinks figures that sit further "back" in the scene.
export const SLOTS: { x: number; y: number; scale: number; flip?: boolean }[] = [
  { x: 700, y: 1120, scale: 1.0 },
  { x: 1750, y: 1010, scale: 0.95, flip: true },
  { x: 980, y: 870, scale: 0.85 },
  { x: 480, y: 960, scale: 0.9, flip: true },
  { x: 2120, y: 1120, scale: 0.85 },
  { x: 1560, y: 650, scale: 0.7, flip: true },
  { x: 830, y: 640, scale: 0.7 },
  { x: 1980, y: 880, scale: 0.75, flip: true },
]

export const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000
