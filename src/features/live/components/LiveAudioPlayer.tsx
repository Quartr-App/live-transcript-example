import { useEffect } from "react";
import { setupAudioPlayer } from "../utilities/setupAudioPlayer";
import { useLiveState } from "../useLiveState";

export type AudioPlayerProps = {
  audioUrl: string;
};

export const AudioPlayer = ({ audioUrl }: AudioPlayerProps) => {
  const setAudioElement = useLiveState((state) => state.setAudioElement);

  useEffect(() => {
    const audioElement = useLiveState.getState().audioElement;
    if (!audioElement) return;

    return setupAudioPlayer(audioElement, audioUrl);
  }, [audioUrl]);

  return (
    <div>
      <audio controls ref={setAudioElement} />
    </div>
  );
};
