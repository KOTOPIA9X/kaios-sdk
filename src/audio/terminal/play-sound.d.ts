/**
 * Type declarations for play-sound module
 */
declare module 'play-sound' {
  interface PlaySoundOptions {
    player?: string
    players?: string[]
  }

  interface Player {
    play(path: string, callback?: (err: Error | null) => void): void
  }

  function playSound(options?: PlaySoundOptions): Player
  export = playSound
}
