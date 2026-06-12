import { openDB, type IDBPDatabase } from "idb";
import type { Nuzlock } from "@/types/nuzlock";
import type {
  MetaRecord,
  PokemonCacheRecord,
  StorageAdapter,
} from "./types";
import { DB_NAME, DB_VERSION, STORES } from "./types";

type AppDB = IDBPDatabase<{
  nuzlocks: { key: string; value: Nuzlock };
  "pokemon-cache": { key: string; value: PokemonCacheRecord };
  meta: { key: string; value: MetaRecord };
}>;

let dbPromise: Promise<AppDB> | null = null;

function getDb(): Promise<AppDB> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORES.nuzlocks)) {
          db.createObjectStore(STORES.nuzlocks, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORES.pokemonCache)) {
          db.createObjectStore(STORES.pokemonCache, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(STORES.meta)) {
          db.createObjectStore(STORES.meta, { keyPath: "key" });
        }
      },
    });
  }
  return dbPromise;
}

export const indexedDbStorage: StorageAdapter = {
  async getAllNuzlocks() {
    const db = await getDb();
    return db.getAll(STORES.nuzlocks);
  },

  async getNuzlock(id) {
    const db = await getDb();
    return db.get(STORES.nuzlocks, id);
  },

  async saveNuzlock(nuzlock) {
    const db = await getDb();
    await db.put(STORES.nuzlocks, nuzlock);
  },

  async deleteNuzlock(id) {
    const db = await getDb();
    await db.delete(STORES.nuzlocks, id);
  },

  async getPokemonCache() {
    const db = await getDb();
    return db.get(STORES.pokemonCache, "species");
  },

  async savePokemonCache(cache) {
    const db = await getDb();
    await db.put(STORES.pokemonCache, cache);
  },
};
