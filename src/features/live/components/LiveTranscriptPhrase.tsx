import { memo } from "react";
import { useLiveState } from "../useLiveState";

export type LiveTranscriptPhraseProps = {
  start: number;
  text: string;
};

export const LiveTranscriptPhrase = memo(
  ({ start, text }: LiveTranscriptPhraseProps) => {
    const isActive = useLiveState((state) => {
      return state.currentTime >= start;
    });
    return (
      <button
        type="button"
        className={`hover:bg-neutral-300 cursor-pointer ${
          isActive ? "opacity-100" : "opacity-50"
        }`}
        onClick={scrubToPhrase}
        data-start={start}
      >
        {text}
      </button>
    );
  }
);

LiveTranscriptPhrase.displayName = "LiveTranscriptPhrase";

const scrubToPhrase = (ev: React.MouseEvent<HTMLButtonElement>) => {
  const start = ev.currentTarget.dataset.start;

  useLiveState.getState().setCurrentTime(Number(start));
};
