import type { LiveTSEntry, LiveTSParagraph } from "../LiveTSProtocol";
import { parseLiveTranscript } from "./parseLiveTranscript";

// Very basic data fetching without any libraries to
// simplify the example. In a real-world application there
// would be both retries and error handling.

export const fetchLiveTranscript = async (
  url: string,
  start: number,
  signal: AbortSignal
) => {
  const response = await fetch(url, {
    headers: {
      range: `bytes=${start}-`,
    },
    signal,
  });

  const data = await response.text();

  const nextStart = extractRangeFromHeader(
    response.headers.get("Content-Range")
  );

  const parsed = parseLiveTranscript(data);
  // Currently we only support to entries,
  // But in a real world application is would be good to handle start/end/section as well.
  const entries = parsed.filter((entry) => "t" in entry);

  const paragraphs = entriesToParagraps(entries);

  return [nextStart, paragraphs] as const;
};

export const extractRangeFromHeader = (rangeHeader: string | null) =>
  Number.parseInt(rangeHeader?.split("-")[1].split("/")[0] || "0");

const entriesToParagraps = (entries: LiveTSEntry[]): LiveTSParagraph[] => {
  const record = entries.reduce((acc, entry) => {
    const { t: text, S: speaker, p: paragraph, e: end, s: start } = entry;

    const id = `${paragraph}`;

    if (!acc[id]) {
      acc[id] = {
        id,
        speaker,
        start,
        end,
        words: [{ end, start, text }],
      };
    } else {
      acc[id].words.push({ end, start, text });
    }

    return acc;
  }, {} as Record<string, LiveTSParagraph>);

  return Object.values(record);
};
