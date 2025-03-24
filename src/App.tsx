import { useState } from "react";
import { DUMMY_CALL, DUMMY_LIVE_TS } from "./constants";
import { LiveTranscriptRenderer } from "./features/live/components/LiveTranscriptRenderer";

export const App = () => {
  const [timestamp] = useState<string>(() => getStartDate().toISOString());

  const audioUrl = timestamp ? `${DUMMY_CALL}?start=${timestamp}` : DUMMY_CALL;
  const liveTranscriptUrl = timestamp
    ? `${DUMMY_LIVE_TS}?start=${timestamp}`
    : DUMMY_LIVE_TS;

  return (
    <div className="h-dvh max-w-5xl mx-auto p-4">
      <LiveTranscriptRenderer
        audioUrl={audioUrl}
        liveTranscriptUrl={liveTranscriptUrl}
      />
    </div>
  );
};

const getStartDate = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 10);
  return date;
};
