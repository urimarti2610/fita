/// <reference lib="webworker" />

import { type ConvertRequest, convert } from "./convert.js";
import { ConvertError } from "./epub.js";

export type WorkerMessage =
  | { type: "progress"; value: number }
  | { type: "done"; blob: Blob; name: string }
  | { type: "error"; code: "drm" | "invalid" | "failed"; detail?: string };

const post = (message: WorkerMessage) => self.postMessage(message);

self.onmessage = async (event: MessageEvent<ConvertRequest>) => {
  try {
    let last = -1;
    const result = await convert(event.data, (value) => {
      const rounded = Math.round(value * 100);
      if (rounded === last) return;
      last = rounded;
      post({ type: "progress", value: rounded / 100 });
    });
    post({ type: "done", ...result });
  } catch (error) {
    if (error instanceof ConvertError) post({ type: "error", code: error.code });
    else post({ type: "error", code: "failed", detail: String(error) });
  }
};
