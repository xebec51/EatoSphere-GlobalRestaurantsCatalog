import { openDB } from 'idb';

const DATABASE_NAME = 'favorite-restaurants';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'restaurants';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
  },
});

const FavoriteRestaurantIdb = {
  async get(id) {
    if (!id) {
      console.warn('Invalid ID for fetching restaurant.');
      return null;
    }
    const db = await dbPromise;
    const restaurant = await db.get(OBJECT_STORE_NAME, id);
    console.log('Fetched restaurant:', restaurant);
    return restaurant;
  },
  async getAll() {
    const db = await dbPromise;
    return db.getAll(OBJECT_STORE_NAME);
  },
  async put(restaurant) {
    if (!restaurant || !restaurant.id) {
      console.warn('Invalid restaurant data. Skipping save.', restaurant);
      return;
    }
    console.log('Saving restaurant:', restaurant);
    const db = await dbPromise;
    return db.put(OBJECT_STORE_NAME, restaurant);
  },
  async delete(id) {
    if (!id) {
      console.warn('Invalid ID for deletion. Skipping delete.');
      return;
    }
    console.log(`Deleting restaurant with ID: ${id}`);
    const db = await dbPromise;
    await db.delete(OBJECT_STORE_NAME, id);
    console.log(`Restaurant with ID: ${id} deleted successfully.`);
  },
};

export default FavoriteRestaurantIdb;
