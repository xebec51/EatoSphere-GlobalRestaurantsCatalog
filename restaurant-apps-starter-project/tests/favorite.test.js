import { openDB } from 'idb';

const DATABASE_NAME = 'favorite-restaurants';
const STORE_NAME = 'restaurants';

let db;

// Setup IndexedDB untuk pengujian
beforeAll(async () => {
  db = await openDB(DATABASE_NAME, 1, {
    upgrade(database) {
      database.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
  });
});

afterAll(async () => {
  if (db) {
    await db.close();
  }
});

// Membersihkan store sebelum setiap pengujian
beforeEach(async () => {
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).clear();
  await tx.done;
});

describe('Favorite Restaurants Integration Test', () => {
  it('should add a restaurant to the favorite list', async () => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const restaurant = { id: 'r1', name: 'Restaurant 1' };
    await tx.objectStore(STORE_NAME).put(restaurant);
    await tx.done;

    const savedRestaurant = await db.get(STORE_NAME, 'r1');
    expect(savedRestaurant).toEqual(restaurant);
  });

  it('should remove a restaurant from the favorite list', async () => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const restaurant = { id: 'r2', name: 'Restaurant 2' };
    await tx.objectStore(STORE_NAME).put(restaurant);
    await tx.done;

    const deleteTx = db.transaction(STORE_NAME, 'readwrite');
    await deleteTx.objectStore(STORE_NAME).delete('r2');
    await deleteTx.done;

    const deletedRestaurant = await db.get(STORE_NAME, 'r2');
    expect(deletedRestaurant).toBeUndefined();
  });

  it('should not add a restaurant that already exists', async () => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const restaurant = { id: 'r3', name: 'Restaurant 3' };
    await tx.objectStore(STORE_NAME).put(restaurant);
    await tx.done;

    const duplicateTx = db.transaction(STORE_NAME, 'readwrite');
    await duplicateTx.objectStore(STORE_NAME).put(restaurant);
    await duplicateTx.done;

    const savedRestaurant = await db.get(STORE_NAME, 'r3');
    expect(savedRestaurant).toEqual(restaurant);
  });

  it('should return an empty list if no restaurant is saved', async () => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const allRestaurants = await tx.objectStore(STORE_NAME).getAll();
    await tx.done;

    expect(allRestaurants).toEqual([]);
  });

  // Tambahkan pengujian untuk skenario kesalahan
  it('should return undefined if trying to get a non-existent restaurant', async () => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const result = await tx.objectStore(STORE_NAME).get('non-existent-id');
    await tx.done;
    expect(result).toBeUndefined();
  });

  // Tambahkan pengujian untuk memastikan data tetap utuh setelah beberapa operasi
  it('should retain data integrity after multiple operations', async () => {
    const tx1 = db.transaction(STORE_NAME, 'readwrite');
    const restaurant1 = { id: 'r4', name: 'Restaurant 4' };
    await tx1.objectStore(STORE_NAME).put(restaurant1);
    await tx1.done;

    const tx2 = db.transaction(STORE_NAME, 'readwrite');
    const restaurant2 = { id: 'r5', name: 'Restaurant 5' };
    await tx2.objectStore(STORE_NAME).put(restaurant2);
    await tx2.done;

    const tx3 = db.transaction(STORE_NAME, 'readwrite');
    await tx3.objectStore(STORE_NAME).delete('r4');
    await tx3.done;

    const savedRestaurant2 = await db.get(STORE_NAME, 'r5');
    expect(savedRestaurant2).toEqual(restaurant2);

    const deletedRestaurant1 = await db.get(STORE_NAME, 'r4');
    expect(deletedRestaurant1).toBeUndefined();
  });
});
