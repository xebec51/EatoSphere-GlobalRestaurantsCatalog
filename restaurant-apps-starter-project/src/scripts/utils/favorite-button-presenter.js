import FavoriteRestaurantIdb from '../data/favorite-restaurant-idb';

const FavoriteButtonPresenter = {
  async init({ favoriteButtonContainer, restaurant }) {
    if (!favoriteButtonContainer) {
      console.error('favoriteButtonContainer is not available in the DOM.');
      return;
    }

    if (!restaurant || !restaurant.id) {
      console.error('Invalid restaurant data. Skipping initialization.', restaurant);
      return;
    }

    this._favoriteButtonContainer = favoriteButtonContainer;
    this._restaurant = restaurant;

    console.log('Initializing Favorite Button for Restaurant:', this._restaurant);
    await this._renderButton();
  },

  async _renderButton() {
    const { id } = this._restaurant;

    if (await this._isRestaurantFavorited(id)) {
      this._renderFavorited();
    } else {
      this._renderUnfavorited();
    }
  },

  async _isRestaurantFavorited(id) {
    if (!id) return false;
    const restaurant = await FavoriteRestaurantIdb.get(id);
    console.log('Fetched restaurant:', restaurant);
    return !!restaurant;
  },

  _renderFavorited() {
    console.log('Rendering Favorited Button...');
    this._favoriteButtonContainer.innerHTML = `
      <button id="favoriteButton" aria-label="Hapus dari Favorit">Hapus dari Favorit</button>
    `;

    const button = this._favoriteButtonContainer.querySelector('#favoriteButton');
    if (!button) {
      console.error('Favorite button not rendered in _renderFavorited.');
      return;
    }

    button.addEventListener('click', async () => {
      console.log(`Removing restaurant with ID: ${this._restaurant.id}`);
      await FavoriteRestaurantIdb.delete(this._restaurant.id);
      console.log(`Restaurant with ID: ${this._restaurant.id} successfully removed.`);
      await this._renderButton();
    });
  },

  _renderUnfavorited() {
    console.log('Rendering Unfavorited Button...');
    this._favoriteButtonContainer.innerHTML = `
      <button id="favoriteButton" aria-label="Tambahkan ke Favorit">Tambahkan ke Favorit</button>
    `;

    const button = this._favoriteButtonContainer.querySelector('#favoriteButton');
    if (!button) {
      console.error('Favorite button not rendered in _renderUnfavorited.');
      return;
    }

    button.addEventListener('click', async () => {
      console.log(`Adding restaurant with ID: ${this._restaurant.id} to favorites.`);
      await FavoriteRestaurantIdb.put(this._restaurant);
      console.log(`Restaurant with ID: ${this._restaurant.id} successfully added to favorites.`);
      await this._renderButton();
    });
  },
};

export default FavoriteButtonPresenter;
