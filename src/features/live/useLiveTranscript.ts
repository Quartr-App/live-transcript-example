import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { LiveTSParagraph } from "./LiveTSProtocol";
import { fetchLiveTranscript } from "./utilities/fetchLiveTranscript";

export const useLiveTranscript = (liveTranscriptUrl: string) => {
  const [paragraphs, setParagraphs] = useState<LiveTSParagraph[]>([]);

  const onRetrieve = useCallback((newParagraphs: LiveTSParagraph[] | null) => {
    setParagraphs((prev) => {
      if (!newParagraphs) return [];
      if (prev.length === 0) return newParagraphs;
      if (newParagraphs.length === 0) return prev;

      const newParagraphsMap = new Map<string, LiveTSParagraph>();

      for (const paragraph of newParagraphs) {
        newParagraphsMap.set(paragraph.id, paragraph);
      }

      const updatedParagraphs = prev.map((paragraph) => {
        const newParagraph = newParagraphsMap.get(paragraph.id);
        if (newParagraph) {
          const combinedWords = [...paragraph.words, ...newParagraph.words];
          const words = Array.from(
            new Map(combinedWords.map((word) => [word.start, word]))
          )
            .sort((a, b) => a[0] - b[0])
            .map((word) => word[1]);

          return {
            ...paragraph,
            end: newParagraph.end,
            words,
          };
        }
        return paragraph;
      });
      const newParagraphsFiltered = newParagraphs.filter(
        (paragraph) => !updatedParagraphs.some((p) => p.id === paragraph.id)
      );
      return [...updatedParagraphs, ...newParagraphsFiltered];
    });
  }, []);

  useFetchLiveTranscript(liveTranscriptUrl, onRetrieve);

  return useMemo(() => ({ paragraphs: paragraphs }), [paragraphs]);
};

export const useFetchLiveTranscript = (
  liveTranscriptUrl: string,
  onRetrieve: (paragraphs: LiveTSParagraph[] | null) => void
) => {
  const bytesFetchedRef = useRef<number>(0);
  useEffect(() => {
    const abortController = new AbortController();

    const execute = () => {
      fetchLiveTranscript(
        liveTranscriptUrl,
        bytesFetchedRef.current,
        abortController.signal
      )
        .then(([bytesFetched, paragraphs]) => {
          bytesFetchedRef.current = bytesFetched;
          onRetrieve(paragraphs);
        })
        .catch(() => {});
    };

    const interval = setInterval(execute, 2000);

    execute();

    return () => {
      abortController.abort("liveTranscriptUrl or onRetrieve changed");
      bytesFetchedRef.current = 0;
      onRetrieve(null);
      clearInterval(interval);
    };
  }, [liveTranscriptUrl, onRetrieve]);
};
