import { useCallback } from "react";
import { READWRITE, READONLY } from "./transactionTypes";

export function openDataBase(name, version) {
  return new Promise((resolve, reject) => {
    let db = null;

    const request = indexedDB.open(name, version);

    request.onsuccess = e => {
      db = e.target.result;

      resolve(db);
    }

    request.onerror = e => reject(e.error);
  })
}

export function DBOperations(name, version, store) {
  const add = useCallback(val => {
    return new Promise((resolve, reject) => {
      openDataBase(name, version).then(db => {
        let transaction = db.transaction([store], READWRITE).objectStore(store);
        let addOperation = transaction.add(val);

        addOperation.onsuccess = () => resolve();
        addOperation.onerror = err => reject(err);
      })
    })
  }, [name, version, store]);

  const update = useCallback(val => {
    return new Promise((resolve, reject) => {
      openDataBase(name, version).then(db => {
        let transaction = db.transaction([store], READWRITE).objectStore(store);
        let updateOperation = transaction.put(val);

        updateOperation.onsuccess = e => resolve(e.target.result);
        updateOperation.onerror = err => reject(err);
      })
    })
  }, [name, version, store]);

  const destroy = useCallback(id => {
    return new Promise((resolve, reject) => {
      openDataBase(name, version).then(db => {
        let transaction = db.transaction([store], READWRITE).objectStore(store);
        let destroyOperation = transaction.delete(id);

        destroyOperation.onsuccess = e => resolve('Successfully Deleted.');
        destroyOperation.onerror = err => reject(err);
      })
    })
  }, [name, version, store]);

  const getAll = useCallback(() => {
    return new Promise((resolve, reject) => {
      openDataBase(name, version).then(db => {
        let transaction = db.transaction([store], READONLY).objectStore(store);
        let getDataByIdCursor = transaction.getAll();

        getDataByIdCursor.onsuccess = e => resolve(e.target.result);
        getDataByIdCursor.onerror = err => reject(err);
      })
    });
  }, [name, version, store]);

  const getById = useCallback(id => {
    return new Promise((resolve, reject) => {
      openDataBase(name, version).then(db => {
        let transaction = db.transaction([store], READONLY).objectStore(store);
        let getDataByIdCursor = transaction.openCursor(IDBKeyRange.only(id));

        getDataByIdCursor.onsuccess = e => resolve(e.target.result.value);
        getDataByIdCursor.onerror = err => reject(err);
      })
    });
  }, [name, version, store]);

  return {
    add,
    update,
    destroy,
    getAll,
    getById,
  }
}