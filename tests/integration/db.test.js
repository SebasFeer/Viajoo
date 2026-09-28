// Prueba de integración: db.js (la capa de acceso a datos) contra una
// IndexedDB real (fake-indexeddb simula el motor del navegador), no
// contra mocks — comprueba que CRUD + el índice "trip_id" funcionan
// juntos de verdad, tal como los usa el resto de la app.
import "fake-indexeddb/auto";
import { describe, it, expect, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";

async function freshDb() {
  // Cada test parte de una IndexedDB completamente vacía y de un
  // db.js recién importado (vi.resetModules limpia su caché interna
  // de conexión — dbInstance —, si no la primera llamada a openDB()
  // de cada test seguiría devolviendo la conexión de un test anterior).
  globalThis.indexedDB = new IDBFactory();
  vi.resetModules();
  return import("../../js/db.js");
}

describe("Data (db.js) contra IndexedDB", () => {
  it("crea, lee, actualiza y borra un viaje", async () => {
    const { Data } = await freshDb();
    const id = await Data.add("trips", { name: "Roma", destination: "Roma" });
    expect(await Data.get("trips", id)).toMatchObject({ name: "Roma" });

    await Data.put("trips", { id, name: "Roma (editado)", destination: "Roma" });
    expect((await Data.get("trips", id)).name).toBe("Roma (editado)");

    await Data.delete("trips", id);
    expect(await Data.get("trips", id)).toBeNull();
  });

  it("indexa los hijos de un viaje por trip_id con getAllByTrip", async () => {
    const { Data } = await freshDb();
    const tripA = await Data.add("trips", { name: "Roma" });
    const tripB = await Data.add("trips", { name: "Lisboa" });

    await Data.add("hotels", { trip_id: tripA, name: "Hotel A1" });
    await Data.add("hotels", { trip_id: tripA, name: "Hotel A2" });
    await Data.add("hotels", { trip_id: tripB, name: "Hotel B1" });

    const hotelsA = await Data.getAllByTrip("hotels", tripA);
    const hotelsB = await Data.getAllByTrip("hotels", tripB);
    expect(hotelsA.map((h) => h.name).sort()).toEqual(["Hotel A1", "Hotel A2"]);
    expect(hotelsB.map((h) => h.name)).toEqual(["Hotel B1"]);
  });

  it("getAll devuelve todos los registros de un almacén", async () => {
    const { Data } = await freshDb();
    await Data.add("trips", { name: "Uno" });
    await Data.add("trips", { name: "Dos" });
    const trips = await Data.getAll("trips");
    expect(trips).toHaveLength(2);
  });

  it("settingGet/settingSet guardan valores sueltos por clave", async () => {
    const { Data } = await freshDb();
    expect(await Data.settingGet("is_pro")).toBeUndefined();
    await Data.settingSet("is_pro", true);
    expect(await Data.settingGet("is_pro")).toBe(true);
  });

  it("avisa a los oyentes de onDataChange tras escribir", async () => {
    const { Data, onDataChange } = await freshDb();
    const seen = [];
    onDataChange((storeName) => seen.push(storeName));
    await Data.add("expenses", { trip_id: 1, amount: 10 });
    expect(seen).toContain("expenses");
  });
});
