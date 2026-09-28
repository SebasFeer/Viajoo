import { describe, it, expect } from "vitest";
import { money, escapeHtml, formatDatePretty, daysBetween, daysUntil, mapsQueryUrl, mapsRouteUrl, uid } from "../../js/utils.js";

describe("money", () => {
  it("formats a number with two decimals and the euro sign", () => {
    expect(money(12)).toBe("12.00 €");
    expect(money(12.3)).toBe("12.30 €");
  });

  it("treats missing/invalid values as zero", () => {
    expect(money(undefined)).toBe("0.00 €");
    expect(money(null)).toBe("0.00 €");
    expect(money("")).toBe("0.00 €");
  });
});

describe("escapeHtml", () => {
  it("escapes the five HTML-sensitive characters", () => {
    expect(escapeHtml(`<script>alert("x") & 'y'</script>`)).toBe(
      "&lt;script&gt;alert(&quot;x&quot;) &amp; &#039;y&#039;&lt;/script&gt;"
    );
  });

  it("returns an empty string for null/undefined instead of throwing", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  it("coerces non-string input", () => {
    expect(escapeHtml(42)).toBe("42");
  });
});

describe("formatDatePretty", () => {
  it("formats an ISO date as 'd mon yyyy' in Spanish", () => {
    expect(formatDatePretty("2026-09-13")).toBe("13 sep 2026");
    expect(formatDatePretty("2026-01-01")).toBe("1 ene 2026");
  });

  it("returns an empty string for a falsy date", () => {
    expect(formatDatePretty("")).toBe("");
    expect(formatDatePretty(null)).toBe("");
  });

  it("returns the original string when it isn't a y-m-d date", () => {
    expect(formatDatePretty("2026")).toBe("2026");
  });
});

describe("daysBetween", () => {
  it("counts whole days between two ISO dates", () => {
    expect(daysBetween("2026-01-01", "2026-01-05")).toBe(4);
    expect(daysBetween("2026-01-05", "2026-01-01")).toBe(-4);
    expect(daysBetween("2026-01-01", "2026-01-01")).toBe(0);
  });

  it("returns null if either date is missing", () => {
    expect(daysBetween(null, "2026-01-01")).toBeNull();
    expect(daysBetween("2026-01-01", undefined)).toBeNull();
  });
});

describe("daysUntil", () => {
  it("returns 0 for today, positive for the future, negative for the past", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(daysUntil(today)).toBe(0);

    const future = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
    expect(daysUntil(future)).toBe(3);

    const past = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
    expect(daysUntil(past)).toBe(-2);
  });

  it("returns null when there's no date", () => {
    expect(daysUntil(null)).toBeNull();
  });
});

describe("mapsQueryUrl", () => {
  it("builds a Google Maps search URL with the location URL-encoded", () => {
    expect(mapsQueryUrl("Torre Eiffel, París")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Torre%20Eiffel%2C%20Par%C3%ADs"
    );
  });

  it("returns null for an empty/blank location", () => {
    expect(mapsQueryUrl("")).toBeNull();
    expect(mapsQueryUrl("   ")).toBeNull();
  });
});

describe("mapsRouteUrl", () => {
  it("returns a single-point search URL when there's only one stop", () => {
    expect(mapsRouteUrl(["Roma"])).toBe(mapsQueryUrl("Roma"));
  });

  it("builds an origin/destination/waypoints route for 3+ stops", () => {
    const url = mapsRouteUrl(["Madrid", "Zaragoza", "Barcelona"]);
    expect(url).toContain("origin=Madrid");
    expect(url).toContain("destination=Barcelona");
    expect(url).toContain("waypoints=Zaragoza");
  });

  it("drops empty and duplicate stops", () => {
    // Con el duplicado y el hueco fuera, solo quedan 2 paradas reales:
    // debe comportarse como una ruta de 2 puntos, sin "waypoints".
    const url = mapsRouteUrl(["Madrid", "", "Madrid", "Barcelona"]);
    expect(url).toContain("origin=Madrid");
    expect(url).toContain("destination=Barcelona");
    expect(url).not.toContain("waypoints=");
  });

  it("returns null when every stop is empty", () => {
    expect(mapsRouteUrl(["", "  "])).toBeNull();
  });
});

describe("uid", () => {
  it("generates unique, prefixed ids", () => {
    const a = uid("trip");
    const b = uid("trip");
    expect(a).not.toBe(b);
    expect(a.startsWith("trip_")).toBe(true);
  });
});
