// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import {
  type Chunk,
  createReader,
  createTextSource,
  DEFAULT_SPEECH,
  langBase,
  locate,
  pickVoice,
  type SpeechSettings,
  type SpeechState,
  splitText,
  startingPoint,
  wordRange,
} from "../src/speech.js";

const voice = (voiceURI: string, lang: string, localService = true, isDefault = false) =>
  ({ voiceURI, name: voiceURI, lang, localService, default: isDefault }) as SpeechSynthesisVoice;

const VOICES = [
  voice("online-es", "es-ES", false, true),
  voice("monica", "es-ES"),
  voice("paulina", "es-MX"),
  voice("jordi", "ca-ES"),
  voice("samantha", "en-US", true, true),
];

afterEach(() => {
  document.body.innerHTML = "";
  document.documentElement.lang = "";
  document.getSelection()?.removeAllRanges();
});

function chunks(source: ReturnType<typeof createTextSource>): Chunk[] {
  const all: Chunk[] = [];
  for (let c = source.next(); c; c = source.next()) all.push(c);
  return all;
}

describe("voices", () => {
  it("normalizes language codes", () => {
    expect(langBase("pt-BR")).toBe("pt");
    expect(langBase("ca_ES")).toBe("ca");
    expect(langBase("")).toBe("");
  });

  it("never picks an online voice", () => {
    expect(pickVoice(VOICES, "es-ES")?.voiceURI).toBe("monica");
    expect(pickVoice([voice("online", "es-ES", false)], "es")).toBeNull();
    expect(pickVoice(VOICES, "es", "online-es")?.voiceURI).toBe("monica");
  });

  it("prefers the user's choice, then the exact region, then the language", () => {
    expect(pickVoice(VOICES, "es-MX")?.voiceURI).toBe("paulina");
    expect(pickVoice(VOICES, "es", "paulina")?.voiceURI).toBe("paulina");
    expect(pickVoice(VOICES, "ca")?.voiceURI).toBe("jordi");
    expect(pickVoice(VOICES, "de")).toBeNull();
    // A chosen voice of another language is honoured (the user asked for it).
    expect(pickVoice(VOICES, "de", "samantha")?.voiceURI).toBe("samantha");
  });
});

describe("text source", () => {
  it("reads block by block, joining inline elements and skipping hidden or code-like parts", () => {
    document.body.innerHTML = `<h1>Títol</h1><p>Hola <b>món</b>, com va?</p>
      <script>no()</script><p hidden>amagat</p><p aria-hidden="true">ocult</p>
      <ul><li>u</li><li>dos</li></ul><textarea>no</textarea>`;
    const texts = chunks(createTextSource(document.body)).map((c) => c.text.trim());
    expect(texts).toEqual(["Títol", "Hola món, com va?", "u", "dos"]);
  });

  it("uses the closest lang attribute", () => {
    document.documentElement.lang = "ca";
    document.body.innerHTML = `<p>Bon dia</p><p lang="en">Good morning</p>`;
    expect(chunks(createTextSource(document.body)).map((c) => c.lang)).toEqual(["ca", "en"]);
  });

  it("can start and end in the middle of text nodes", () => {
    document.body.innerHTML = `<p id="a">Primer paràgraf aquí.</p><p id="b">Segon paràgraf llarg.</p>`;
    const a = document.querySelector("#a")?.firstChild as Text;
    const b = document.querySelector("#b")?.firstChild as Text;
    const texts = chunks(
      createTextSource(document.body, { node: a, offset: 7 }, { node: b, offset: 5 }),
    );
    expect(texts.map((c) => c.text)).toEqual(["paràgraf aquí.", "Segon"]);
  });

  it("maps characters back to text nodes", () => {
    document.body.innerHTML = `<p>Hola <b>món</b> bonic</p>`;
    const [chunk] = chunks(createTextSource(document.body));
    if (!chunk) throw new Error("no chunk");
    const at = locate(chunk, 6);
    expect(at?.node.data).toBe("món");
    expect(at?.offset).toBe(1);
    expect(wordRange(document, chunk, 5)?.toString()).toBe("món");
    expect(wordRange(document, chunk, 9, 5)?.toString()).toBe("bonic");
    expect(wordRange(document, chunk, 4)).toBeNull(); // a space
  });

  it("walks a huge page lazily", () => {
    document.body.innerHTML = "<p>paraula </p>".repeat(20_000);
    const source = createTextSource(document.body);
    expect(source.next()?.text).toBe("paraula ");
  });
});

describe("splitText", () => {
  it("groups whole sentences up to the limit", () => {
    const text = "Una frase. Una altra frase. I una tercera.";
    const parts = splitText(text, "ca", 20).map(([a, b]) => text.slice(a, b));
    expect(parts.join("")).toBe(text);
    expect(parts.length).toBeGreaterThan(1);
    expect(parts[0]).toBe("Una frase. ");
  });

  it("cuts overlong sentences at spaces and drops blank parts", () => {
    const text = `${"paraula ".repeat(100)}final`;
    const parts = splitText(text, "", 50);
    expect(parts.every(([a, b]) => b - a <= 100)).toBe(true);
    expect(parts.map(([a, b]) => text.slice(a, b)).join("")).toBe(text);
    expect(splitText("   ", "en")).toEqual([]);
  });
});

describe("startingPoint", () => {
  it("reads the selection only", () => {
    document.body.innerHTML = `<p id="p">Hola món bonic</p>`;
    const text = document.querySelector("#p")?.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 5);
    range.setEnd(text, 8);
    document.getSelection()?.addRange(range);
    const { start, end } = startingPoint(document);
    expect(start?.offset).toBe(5);
    expect(end?.offset).toBe(8);
  });

  it("starts at the word under the caret", () => {
    document.body.innerHTML = `<p id="p">Hola món bonic</p>`;
    const text = document.querySelector("#p")?.firstChild as Text;
    const range = document.createRange();
    range.setStart(text, 7);
    range.collapse(true);
    document.getSelection()?.addRange(range);
    expect(startingPoint(document)).toEqual({ start: { node: text, offset: 5 } });
  });

  it("falls back to the first text on the page", () => {
    document.body.innerHTML = `<p id="p">Hola</p>`;
    expect(startingPoint(document).start?.node.data).toBe("Hola");
  });
});

class FakeUtterance {
  voice: SpeechSynthesisVoice | null = null;
  lang = "";
  rate = 1;
  onboundary: ((e: Partial<SpeechSynthesisEvent>) => void) | null = null;
  onend: (() => void) | null = null;
  onerror: ((e: Partial<SpeechSynthesisErrorEvent>) => void) | null = null;
  constructor(public text: string) {}
}

function fakeSynth(voices = VOICES) {
  const spoken: FakeUtterance[] = [];
  const calls: string[] = [];
  return {
    spoken,
    calls,
    synth: {
      getVoices: () => voices,
      speak: (u: SpeechSynthesisUtterance) => spoken.push(u as unknown as FakeUtterance),
      cancel: () => calls.push("cancel"),
      pause: () => calls.push("pause"),
      resume: () => calls.push("resume"),
    },
  };
}

function setup(voices = VOICES, settings: SpeechSettings = { ...DEFAULT_SPEECH, rate: 1.5 }) {
  const fake = fakeSynth(voices);
  const states: SpeechState[] = [];
  const marks: (string | null)[] = [];
  const reader = createReader(document, {
    synth: fake.synth,
    createUtterance: (text) => new FakeUtterance(text) as unknown as SpeechSynthesisUtterance,
    settings: () => settings,
    highlight: (range) => marks.push(range ? range.toString() : null),
    onState: (s) => states.push(s),
  });
  return { ...fake, reader, states, marks };
}

describe("createReader", () => {
  it("reads every block with a local voice, marking words, then stops", async () => {
    document.documentElement.lang = "es";
    document.body.innerHTML = `<p>Hola <i>mundo</i>.</p><p>Adiós.</p>`;
    const { reader, spoken, states, marks } = setup();
    await reader.play();
    expect(reader.state.status).toBe("playing");
    expect(spoken[0]?.text).toBe("Hola mundo.");
    expect(spoken[0]?.voice?.voiceURI).toBe("monica");
    expect(spoken[0]?.rate).toBe(1.5);

    spoken[0]?.onboundary?.({ name: "word", charIndex: 5, charLength: 5 });
    expect(marks.at(-1)).toBe("mundo");
    spoken[0]?.onend?.();
    expect(spoken[1]?.text).toBe("Adiós.");
    spoken[1]?.onend?.();
    expect(reader.state.status).toBe("idle");
    expect(reader.state.error).toBeUndefined();
    expect(marks.at(-1)).toBeNull();
    expect(states.map((s) => s.status)).toEqual(["idle", "playing", "idle"]);
  });

  it("pauses, resumes, toggles and stops", async () => {
    document.body.innerHTML = `<p lang="en">Hello there.</p>`;
    const { reader, spoken, calls } = setup();
    reader.toggle();
    await Promise.resolve();
    await Promise.resolve();
    expect(reader.state.status).toBe("playing");
    reader.toggle();
    expect(reader.state.status).toBe("paused");
    reader.toggle();
    expect(reader.state.status).toBe("playing");
    reader.stop();
    expect(reader.state.status).toBe("idle");
    expect(calls).toEqual(expect.arrayContaining(["pause", "resume", "cancel"]));
    // Events from the cancelled utterance are ignored.
    spoken[0]?.onend?.();
    expect(spoken).toHaveLength(1);
  });

  it("skips past failed utterances but not cancelled ones", async () => {
    document.body.innerHTML = `<p lang="en">One.</p><p lang="en">Two.</p>`;
    const { reader, spoken } = setup();
    await reader.play();
    spoken[0]?.onerror?.({ error: "interrupted" });
    expect(spoken).toHaveLength(1);
    spoken[0]?.onerror?.({ error: "synthesis-failed" });
    expect(spoken[1]?.text).toBe("Two.");
  });

  it("refuses to read without an on-device voice for the language", async () => {
    document.documentElement.lang = "de";
    document.body.innerHTML = `<p>Guten Tag.</p>`;
    const { reader, spoken } = setup();
    await reader.play();
    expect(reader.state).toMatchObject({ status: "idle", error: "noVoice" });
    expect(spoken).toHaveLength(0);

    const online = setup([voice("cloud", "de-DE", false)]);
    await online.reader.play();
    expect(online.reader.state.error).toBe("noVoice");
  });

  it("reports pages without text", async () => {
    document.documentElement.lang = "en";
    document.body.innerHTML = `<img alt="">`;
    const { reader } = setup();
    await reader.play();
    expect(reader.state).toMatchObject({ status: "idle", error: "noText" });
  });
});
