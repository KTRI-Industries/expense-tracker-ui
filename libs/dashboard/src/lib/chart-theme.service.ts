import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * Reads CSS custom-property colour tokens at runtime so Chart.js datasets
 * automatically adapt to whichever theme is active on the <html> element.
 *
 * Call the public methods after the DOM is ready (e.g. in ngOnChanges /
 * ngAfterViewInit) so getComputedStyle() resolves against the live stylesheet.
 */
@Injectable({ providedIn: 'root' })
export class ChartThemeService {
  private readonly doc = inject(DOCUMENT);

  /**
   * Returns the computed value of a CSS custom property (whitespace trimmed).
   * Result is typically a 6-digit hex string (#rrggbb) for colour tokens.
   */
  getCssVar(name: string): string {
    return getComputedStyle(this.doc.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  /**
   * Converts a 6-digit hex colour string to an `rgba()` string.
   * Used to derive semi-transparent fills from opaque token values so that
   * Chart.js bar backgrounds look distinct from their border colour.
   */
  hexToRgba(hex: string, alpha: number): string {
    // Strip the leading # if present, then parse each 8-bit channel.
    const clean = hex.startsWith('#') ? hex.slice(1) : hex;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Income / Expense bar-chart colours.
   *
   * - Income  → `--app-positive`  (green family across all three themes)
   * - Expense → `--app-negative`  (red / terracotta family across all themes)
   *
   * Both tokens are guaranteed to be semantically distinct so the two bars
   * remain visually separable even when the active theme changes.
   */
  getIncomeExpenseColors(): { income: string; expense: string } {
    return {
      income: this.getCssVar('--app-positive'),
      expense: this.getCssVar('--app-negative'),
    };
  }

  /**
   * Returns `count` colours from a 5-stop palette built from semantic theme
   * tokens.  The stops are visually distinct across all three themes (terracotta,
   * slate, navy) and cycle when `count` exceeds 5.
   *
   * Used for doughnut slices (expense-by-category) and per-user line series.
   */
  getPalette(count: number): string[] {
    // Token order is chosen so that the most visually prominent colours come
    // first, matching the typical importance ordering of chart slices/series.
    const tokens = [
      '--app-primary-strong',
      '--app-accent',
      '--app-positive',
      '--app-negative',
      '--app-ink-soft',
    ];
    const resolved = tokens.map((t) => this.getCssVar(t));
    return Array.from({ length: count }, (_, i) => resolved[i % resolved.length]);
  }
}
