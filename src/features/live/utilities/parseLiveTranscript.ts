import type { LiveTSProtocol } from "../LiveTSProtocol";

export const parseLiveTranscript = (response: string) => {
  const messages = response
    .split("\n")
    .filter((line) => line.length !== 0)
    .map((line) => {
      return JSON.parse(line) as LiveTSProtocol;
    });

  return messages;
};
