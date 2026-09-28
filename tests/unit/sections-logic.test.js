// Pruebas de componente para la lógica pura de sections.js (sin DOM):
// el reparto de gastos y la clasificación automática de actividades
// del itinerario. sections.js importa app.js (import circular ya
// existente en la app), así que esto también sirve de comprobación de
// que ese ciclo se puede cargar fuera del navegador sin romperse.
import { describe, it, expect } from "vitest";
import { computeExpenseBalances, simplifyExpenseDebts, classifyActivity } from "../../js/sections.js";

describe("computeExpenseBalances", () => {
  it("ignores expenses not split with anyone (split_with < 2)", () => {
    const balances = computeExpenseBalances(
      [{ amount: 40, paid_by: "me", split_with: [] }, { amount: 10, paid_by: "me", split_with: ["me"] }],
      []
    );
    expect(balances).toEqual([{ id: "me", name: "Yo", amount: 0 }]);
  });

  it("splits a 2-way expense evenly between payer and companion", () => {
    const companions = [{ id: 1, name: "Ana" }];
    const balances = computeExpenseBalances(
      [{ amount: 100, paid_by: "me", split_with: ["me", "1"] }],
      companions
    );
    const byId = Object.fromEntries(balances.map((b) => [b.id, b.amount]));
    expect(byId.me).toBeCloseTo(50); // pagó 100, le tocaban 50 -> le deben 50
    expect(byId["1"]).toBeCloseTo(-50); // le tocaban 50 y no pagó nada -> debe 50
  });

  it("marks an archived companion's debt without losing it", () => {
    const companions = [{ id: 2, name: "Bruno", archived: true }];
    const balances = computeExpenseBalances(
      [{ amount: 20, paid_by: "me", split_with: ["me", "2"] }],
      companions
    );
    const bruno = balances.find((b) => b.id === "2");
    expect(bruno.name).toBe("Bruno (eliminado/a)");
    expect(bruno.amount).toBeCloseTo(-10);
  });

  it("reduces what's owed once a settlement is recorded", () => {
    const companions = [{ id: 1, name: "Ana" }];
    const expenses = [{ amount: 100, paid_by: "me", split_with: ["me", "1"] }];
    const settlements = [{ from: "1", to: "me", amount: 50 }];
    const balances = computeExpenseBalances(expenses, companions, settlements);
    const byId = Object.fromEntries(balances.map((b) => [b.id, b.amount]));
    expect(byId.me).toBeCloseTo(0);
    expect(byId["1"]).toBeCloseTo(0);
  });
});

describe("simplifyExpenseDebts", () => {
  it("returns no settlements when everyone is even", () => {
    expect(simplifyExpenseDebts([{ id: "me", name: "Yo", amount: 0 }])).toEqual([]);
  });

  it("matches a single debtor with a single creditor", () => {
    const settlements = simplifyExpenseDebts([
      { id: "me", name: "Yo", amount: 50 },
      { id: "1", name: "Ana", amount: -50 },
    ]);
    expect(settlements).toEqual([{ fromId: "1", from: "Ana", toId: "me", to: "Yo", amount: 50 }]);
  });

  it("settles three people with the minimum number of transfers", () => {
    // Yo pagué 90€ divididos entre Yo/Ana/Bruno (30€ cada uno):
    // a Yo le deben 60€ en total, entre Ana y Bruno (30€ cada uno).
    const balances = computeExpenseBalances(
      [{ amount: 90, paid_by: "me", split_with: ["me", "1", "2"] }],
      [
        { id: 1, name: "Ana" },
        { id: 2, name: "Bruno" },
      ]
    );
    const settlements = simplifyExpenseDebts(balances);
    expect(settlements).toHaveLength(2);
    expect(settlements.every((s) => s.to === "Yo")).toBe(true);
    const total = settlements.reduce((sum, s) => sum + s.amount, 0);
    expect(total).toBeCloseTo(60);
  });

  it("ignores rounding dust below half a cent", () => {
    expect(
      simplifyExpenseDebts([
        { id: "me", name: "Yo", amount: 0.001 },
        { id: "1", name: "Ana", amount: -0.001 },
      ])
    ).toEqual([]);
  });
});

describe("classifyActivity", () => {
  it("detects a category from keywords in the title", () => {
    expect(classifyActivity({ title: "Torre Eiffel" }).label).toBe("Monumento");
    expect(classifyActivity({ title: "Cena en el bistro" }).label).toBe("Restaurante");
  });

  it("detects a category from keywords in the location when the title doesn't match", () => {
    expect(classifyActivity({ title: "Visita guiada", location: "Museo del Prado" }).label).toBe("Museo");
  });

  it("prefers an explicit type over keyword guessing", () => {
    // El título parece un monumento, pero el usuario eligió "Restaurante" a mano.
    expect(classifyActivity({ title: "Castillo de Praga", type: "Restaurante" }).label).toBe("Restaurante");
  });

  it("falls back to the generic 'Actividad' type otherwise", () => {
    expect(classifyActivity({ title: "Quedada con amigos" }).label).toBe("Actividad");
    expect(classifyActivity({}).label).toBe("Actividad");
  });

  it("treats the literal 'Detectar automático' type as no explicit type", () => {
    expect(classifyActivity({ title: "Museo Reina Sofía", type: "Detectar automático" }).label).toBe("Museo");
  });
});
