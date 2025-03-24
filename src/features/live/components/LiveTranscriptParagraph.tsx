import { memo } from "react";
import type { LiveTSParagraph } from "../LiveTSProtocol";
import { formatTimestamp } from "../utilities/formatTimestamp";
import { LiveTranscriptPhrase } from "./LiveTranscriptPhrase";

export type LiveTranscriptParagraphProps = {
  paragraph: LiveTSParagraph;
};

export const LiveTranscriptParagraph = memo(
  ({ paragraph }: LiveTranscriptParagraphProps) => {
    return (
      <div
        className="grid grid-cols-[100px_1fr] gap-6"
        data-paragraph={paragraph.id}
      >
        <div className="flex flex-col items-end">
          <div className="tabular-nums font-semibold text-sm">
            Speaker {paragraph.speaker}
          </div>
          <div className="text-sm tabular-nums">
            {formatTimestamp(paragraph.start)}
          </div>
        </div>
        <div className="flex flex-wrap gap-x-1 gap-y-0">
          {paragraph.words.map((word) => (
            <LiveTranscriptPhrase
              key={word.start}
              start={word.start}
              text={word.text}
            />
          ))}
        </div>
      </div>
    );
  }
);

LiveTranscriptParagraph.displayName = "LiveTranscriptParagraph";
