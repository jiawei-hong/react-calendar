export const DBConfig = {
  name: 'test_indexed_db',
  version: 1,
  ObjectStores: [
    {
      name: 'events',
      options: {
        keyPath: 'id',
        autoIncrement: true
      }
    }
  ]
}