import { DBOperations } from "./db";

let config = {
  name: null,
  version: null
}

export function initDB(DBConfig) {
  config = { ...DBConfig };

  if (config.name == null || config.version == null) {
    throw Error('Config Name or Version not can be null.');
  }

  const request = indexedDB.open(config.name, config.version);

  request.onsuccess = e => e.target.result.close();
  request.onupgradeneeded = e => {
    let db = e.target.result

    for (let schema of DBConfig.ObjectStores) {
      if (!db.objectStoreNames.contains(schema.name)) {
        db.createObjectStore(schema.name, schema.options);
      }
    }
  }
}

export const useIndexedDB = objectStoreName => {
  return { ...DBOperations(config.name, config.version, objectStoreName) };
};