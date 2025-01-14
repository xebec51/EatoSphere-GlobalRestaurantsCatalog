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
});
