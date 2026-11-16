// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from "vitest";
import { createRuler, lineBox, RULER_TAG, rectAtY } from "../src/ruler.js";

const rect = (top: number, height: number, left = 0, width = 100) => ({
  top,
  height,
  bottom: top + height,
  left,
  width,
});

afterEach(() => {
  document.body.innerHTML = "";
  for (const el of document.querySelectorAll(RULER_TAG)) el.remove();
});

describe("line geometry", () => {
  it("centres the band on the glyph and pads it to the line height", () => {
    const line = lineBox(rect(100, 20), 30, rect(0, 500, 40, 600));
    expect(line.top).toBe(95);
    expect(line.height).toBe(30);
    expect(line.left).toBeLessThan(40);
    expect(line.width).toBeGreaterThan(600);
  });

  it("keeps the glyph height when the line height is unknown or smaller", () => {
    expect(lineBox(rect(10, 20), Number.NaN, rect(0, 0)).height).toBe(20);
    expect(lineBox(rect(10, 20), 12, rect(0, 0)).height).toBe(20);
  });

  it("finds the rect on the pointer's line, ignoring empty ones", () => {
    const rects = [rect(0, 0), rect(10, 20), rect(40, 20)];
    expect(rectAtY(rects, 45)).toEqual(rect(40, 20));
    expect(rectAtY(rects, 31)).toEqual(rect(10, 20));
    expect(rectAtY(rects, 200)).toBeNull();
  });
});

describe("createRuler", () => {
  it("adds a hidden, inert overlay outside the body and removes it when off", () => {
    document.body.innerHTML = "<p>Hola món, això és una prova.</p>";
    const before = document.body.innerHTML;
    const ruler = createRuler(document);

    ruler.set("band");
    const host = document.querySelector(RULER_TAG) as HTMLElement;
    expect(host).not.toBeNull();
    expect(host.parentElement).toBe(document.documentElement);
    expect(host.getAttribute("aria-hidden")).toBe("true");
    expect(host.dataset.mode).toBe("band");
    expect(document.body.innerHTML).toBe(before);

    ruler.set("dim");
    expect(document.querySelectorAll(RULER_TAG)).toHaveLength(1);
    expect(host.dataset.mode).toBe("dim");

    ruler.set("off");
    expect(document.querySelector(RULER_TAG)).toBeNull();
    expect(document.body.innerHTML).toBe(before);
    expect(ruler.line).toBeNull();
  });

  it("stops listening once off", () => {
    document.body.innerHTML = "<p><a href='#'>enllaç</a></p>";
    const ruler = createRuler(document);
    ruler.set("band");
    ruler.set("off");
    document.querySelector("a")?.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    document.dispatchEvent(new PointerEvent("pointermove", { clientX: 5, clientY: 5 }));
    expect(ruler.line).toBeNull();
    expect(document.querySelector(RULER_TAG)).toBeNull();
  });

  it("is idempotent", () => {
    const ruler = createRuler(document);
    ruler.set("band");
    ruler.set("band");
    expect(document.querySelectorAll(RULER_TAG)).toHaveLength(1);
    ruler.set("off");
    ruler.set("off");
    expect(document.querySelectorAll(RULER_TAG)).toHaveLength(0);
  });
});
