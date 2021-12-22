import React from "react"

export function IndexedDB({ name, version, children }) {
  const indexDBContext = React.createContext({
    name: name,
    version: version
  });

  const Provider = indexDBContext.Provider;

  return <Provider value={{ name: name }}>{children}</ Provider>
}