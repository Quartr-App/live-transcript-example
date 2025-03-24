import { useCallback, useEffect, useRef, useState } from "react";
import { useLiveTranscript } from "../useLiveTranscript";
import { LiveTranscriptParagraph } from "./LiveTranscriptParagraph";
import { AudioPlayer } from "./LiveAudioPlayer";
import { useLiveState } from "../useLiveState";

export type LiveTranscriptRendererProps = {
  liveTranscriptUrl: string;
  audioUrl: string;
};

export const LiveTranscriptRenderer = ({
  liveTranscriptUrl,
  audioUrl,
}: LiveTranscriptRendererProps) => {
  const { paragraphs } = useLiveTranscript(liveTranscriptUrl);

  const scrollViewRef = useRef<HTMLDivElement>(null);

  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  const disableScrolling = useCallback(() => setIsAutoScrollEnabled(false), []);
  const toggleScrolling = useCallback(
    () => setIsAutoScrollEnabled((s) => !s),
    []
  );

  useEffect(() => {
    const scrollToActiveParagraph = (time: number) => {
      if (!isAutoScrollEnabled) return;
      const scrollView = scrollViewRef.current;
      if (!scrollView) return;

      const activeParagraphs = paragraphs.filter((paragraph) => {
        const start = paragraph.start;
        return time >= start;
      });

      const activeParagraph = activeParagraphs[activeParagraphs.length - 1];

      if (!activeParagraph) return;

      const activePhrases = activeParagraph.words.filter((word) => {
        const start = word.start;
        return time >= start;
      });

      const activePhrase = activePhrases[activePhrases.length - 1];

      if (!activePhrase) return;

      const phraseElement = scrollView.querySelector(
        `[data-start="${activePhrase.start}"]`
      ) as HTMLSpanElement;

      if (!phraseElement) return;
      phraseElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    };

    scrollToActiveParagraph(useLiveState.getState().currentTime);

    return useLiveState.subscribe((state) => {
      scrollToActiveParagraph(state.currentTime);
    });
  }, [isAutoScrollEnabled, paragraphs]);

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold">Quartr Live Transcript</div>
        <div className="flex gap-1 items-center">
          <button
            className={`${
              isAutoScrollEnabled
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-neutral-700 hover:bg-neutral-800"
            } text-white p-1 rounded-md text-sm font-medium transition duration-100`}
            type="button"
            onClick={toggleScrolling}
          >
            Auto scroll {isAutoScrollEnabled ? "on" : "off"}
          </button>
          <AudioPlayer audioUrl={audioUrl} />
        </div>
      </div>
      <div
        className="h-full flex flex-col gap-3 overflow-y-auto"
        ref={scrollViewRef}
        onWheel={disableScrolling}
      >
        {paragraphs.map((paragraph) => (
          <LiveTranscriptParagraph key={paragraph.id} paragraph={paragraph} />
        ))}
      </div>
    </div>
  );
};
