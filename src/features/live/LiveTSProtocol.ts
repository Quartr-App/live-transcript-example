export type LiveTSEntry = {
  /**
   * Start time in seconds
   */
  s: number;
  /**
   * End time in seconds
   */
  e: number;
  /**
   * Paragraph id
   */
  p: string;
  /**
   * Text of the paragraph
   *
   * Can be [indiscernible] if the transcription isn't confident enough
   */
  t: string;

  /**
   * Original Text
   *
   * Included when the text is [indiscernible]
   */
  ot?: string;
  /**
   * Speaker number, zero indexed
   */
  S: string;
};

export type LiveTSStart = {
  type: "start";
  /**
   * ISO 8601 date string
   */
  processing_start_time: string;
  file_format_version: string;
};

export type LiveTSEnd = {
  type: "end";
  /**
   * Technical message. Should not be displayed, but can be used for debugging or logging
   */
  system_reason?: string;
  /**
   * Visible message to the user
   */
  user_reason?: string;
};

export type LiveTSSection = {
  type: "section";
  name: "predicted-qna" | "predicted-speech";
  /**
   * Start time in seconds
   * Optional, because it will not be sent when the section ends
   */
  s?: number;
  /**
   * End time in seconds
   * Optional, because it will not be sent when the section starts
   */
  e?: number;
};

export type LiveTSProtocol =
  | LiveTSEntry
  | LiveTSStart
  | LiveTSEnd
  | LiveTSSection;

export type LiveTSPhrase = {
  start: number;
  end: number;
  text: string;
};

export type LiveTSParagraph = {
  id: string;
  speaker: string;
  start: number;
  end: number;
  words: LiveTSPhrase[];
};
