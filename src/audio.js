export function createAudioController(src) {
  const audio = new Audio(src);
  audio.loop = true;
  audio.preload = "auto";
  audio.playsInline = true;
  audio.volume = 0.82;

  let unlocked = false;

  async function unlockAudio() {
    try {
      await audio.play();
      unlocked = true;
      return { ok: true, unlocked };
    } catch (error) {
      return { ok: false, unlocked, error };
    }
  }

  async function toggleAudio() {
    if (audio.paused) {
      return unlockAudio();
    }

    audio.pause();
    return { ok: true, unlocked, paused: true };
  }

  function isPlaying() {
    return !audio.paused;
  }

  return {
    audio,
    unlockAudio,
    toggleAudio,
    isPlaying
  };
}
