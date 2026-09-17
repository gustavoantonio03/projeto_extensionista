import { describe, expect, it } from "vitest";
import { a11y, colors, shadows } from "./tokens";

describe("design tokens — Serene Clinical Humanism", () => {
  it("não usa branco puro como superfície base (anti-branco hospitalar)", () => {
    expect(colors.surface).not.toBe("#ffffff");
    expect(colors.background).not.toBe("#ffffff");
  });

  it("primária é o teal petroleum do DESIGN.md", () => {
    expect(colors.primaryContainer.toLowerCase()).toBe("#134e54");
  });

  it("sombras usam tint petroleum (rgba com 19,78,84), nunca preto puro", () => {
    for (const shadow of [shadows.level1, shadows.level2]) {
      expect(shadow).toMatch(/rgba\(19, 78, 84/);
      expect(shadow).not.toMatch(/rgba\(0, 0, 0/);
    }
  });

  it("regras duras de acessibilidade", () => {
    expect(a11y.minBaseFontSizePx).toBeGreaterThanOrEqual(15);
    expect(a11y.minTouchTargetPx).toBeGreaterThanOrEqual(48);
    expect(a11y.primaryTouchTargetPx).toBeGreaterThanOrEqual(56);
  });
});
