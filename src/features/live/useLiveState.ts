import { create } from "zustand";

export type LiveState = {
  audioElement: HTMLAudioElement | null;
  setAudioElement: (audioElement: HTMLAudioElement | null) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  setCurrentTime: (currentTime: number) => void;
};

/**
 * Global state for the live transcript player.
 *
 * Perfect for this simple example, but in a real app, you might want to use
 * another state management solution to handle more complex use cases,
 * like multiple active transcripts
 */
export const useLiveState = create<LiveState>((set, get) => {
  return {
    audioElement: null,
    setAudioElement: (audioElement: HTMLAudioElement | null) =>
      set({ audioElement }),
    isPlaying: false,
    setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
    currentTime: 0,
    setCurrentTime: (currentTime: number) => {
      const audio = get().audioElement;

      if (!audio) return;

      audio.currentTime = currentTime;
      audio.play();
    },
  };
});
