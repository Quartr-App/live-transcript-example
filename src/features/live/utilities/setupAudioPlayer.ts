import Hls from "hls.js";
import { useLiveState } from "../useLiveState";

export const setupAudioPlayer = (audio: HTMLAudioElement, audioUrl: string) => {
  if (!audio) return;

  const hls = new Hls({ enableWorker: true, lowLatencyMode: true });

  hls.attachMedia(audio);

  hls.on(Hls.Events.MEDIA_ATTACHED, () => {
    hls.loadSource(audioUrl);
  });

  const onUpdate = () => {
    useLiveState.setState({ currentTime: audio.currentTime });
  };

  audio.addEventListener("timeupdate", onUpdate);

  return () => {
    audio.removeEventListener("timeupdate", onUpdate);
    hls.destroy();
    audio.pause();
  };
};
