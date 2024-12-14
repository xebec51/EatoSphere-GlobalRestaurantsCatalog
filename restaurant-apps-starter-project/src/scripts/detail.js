import { openDB } from 'idb';
import { cekRestoranFavorit } from './favorite';
const mainContent = document.querySelector('#main-content');

// Fungsi untuk membuka koneksi ke IndexedDB
const dbPromise = openDB('favorite-restaurants', 1, {
  upgrade(db) {
    db.createObjectStore('restaurants');
  },
});

// Fungsi untuk menampilkan detail restoran
export async function tampilkanDetailRestoran(id) {
  try {
    const cache = await caches.open('restaurant-detail');
    const cachedResponse = await cache.match(`https://restaurant-api.dicoding.dev/detail/${id}`);
    if (cachedResponse) {
      const data = await cachedResponse.json();
      displayRestaurantDetail(data.restaurant);
    } else {
      const response = await fetch(`https://restaurant-api.dicoding.dev/detail/${id}`);
      const clonedResponse = response.clone(); // Clone the response before consuming it
      const data = await response.json();
      displayRestaurantDetail(data.restaurant);
      // Cache response
      cache.put(`https://restaurant-api.dicoding.dev/detail/${id}`, clonedResponse);
    }
  } catch (error) {
    console.error('Gagal memuat detail restoran:', error);
    mainContent.innerHTML = `
      <div class="restaurant-detail-card">
        <p>Gagal memuat detail restoran. Anda sedang offline. Silakan periksa koneksi internet Anda.</p>
      </div>
    `;
  }
}

// Fungsi untuk menampilkan detail restoran dari IndexedDB
export async function tampilkanDetailRestoranDariIndexedDB(id) {
  const db = await dbPromise;
  const tx = db.transaction('restaurants', 'readonly');
  const store = tx.objectStore('restaurants');
  const restaurant = await store.get(id);
  await tx.done;

  if (restaurant) {
    displayRestaurantDetail(restaurant);
  } else {
    mainContent.innerHTML = '<p>Gagal memuat detail restoran.</p>';
  }
}

async function displayRestaurantDetail(restaurant) {
  try {
    const isFavorited = await cekRestoranFavorit(restaurant.id);

    mainContent.innerHTML = `
      <div class="restaurant-detail-card">
        <div class="restaurant-detail-content">
          <div class="restaurant-header">
            <h2>${restaurant.name}</h2>
          </div>
          
          <div class="restaurant-image-section">
            <img src="https://restaurant-api.dicoding.dev/images/medium/${restaurant.pictureId}" 
                 alt="Image of ${restaurant.name}" 
                 class="restaurant-image">
            
            <div class="restaurant-quick-info">
              <div class="info-card">
                <div class="info-card-label">Rating</div>
                <div class="info-card-value">⭐ ${restaurant.rating}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Kota</div>
                <div class="info-card-value">${restaurant.city}</div>
              </div>
            </div>
          </div>

          <div class="restaurant-main-info">
            <div class="info-section">
              <h3>Alamat</h3>
              <p>${restaurant.address}</p>
            </div>

            <div class="info-section">
              <h3>Deskripsi</h3>
              <p>${restaurant.description}</p>
            </div>

            <button id="favoriteButton" class="favorite-button">
              ${isFavorited ? 'Hapus dari Favorit' : 'Tambahkan ke Favorit'}
            </button>
          </div>

          <div class="restaurant-menus">
            <div class="menu-section">
              <h3>Menu Makanan</h3>
              <ul>${restaurant.menus.foods.map((food) => `<li>${food.name}</li>`).join('')}</ul>
            </div>
            
            <div class="menu-section">
              <h3>Menu Minuman</h3>
              <ul>${restaurant.menus.drinks.map((drink) => `<li>${drink.name}</li>`).join('')}</ul>
            </div>
          </div>

          <div class="reviews-section">
            <h3>Ulasan Pelanggan</h3>
            <div class="reviews">
              ${restaurant.customerReviews.map((review) => `
                <div class="review-card">
                  <h4>${review.name}</h4>
                  <p class="review-date">${review.date}</p>
                  <p class="review-text">${review.review}</p>
                </div>
              `).join('')}
            </div>

            <div class="review-form-container">
              <h3>Tambahkan Ulasan</h3>
              <form id="reviewForm" class="review-form">
                <div class="form-group">
                  <label for="name">Nama</label>
                  <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      minlength="3"
                      placeholder="Masukkan nama Anda"
                  >
                </div>
                <div class="form-group">
                  <label for="review">Ulasan</label>
                  <textarea 
                      id="review" 
                      name="review" 
                      rows="4" 
                      required
                      minlength="10"
                      placeholder="Bagikan pengalaman Anda tentang restoran ini"
                  ></textarea>
                </div>
                <button type="submit" class="submit-review-button" disabled>
                  Kirim Ulasan
                </button>
              </form>
              <div id="reviewSuccess" class="review-success">
                  Terima kasih! Ulasan Anda telah berhasil dikirim.
              </div>
              <div id="reviewError" class="review-error">
                  Maaf, terjadi kesalahan. Silakan coba lagi.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Setup setelah HTML dirender
    await Promise.all([
      setupReviewForm(restaurant),
      setupFavoriteButton(restaurant)
    ]);
  } catch (error) {
    console.error('Error displaying restaurant detail:', error);
    mainContent.innerHTML = '<p>Terjadi kesalahan saat menampilkan detail restoran.</p>';
  }
}

// Fungsi untuk menangani klik tombol favorit
// (This function is already declared earlier in the code)

// Fungsi untuk mengatur form ulasan - tambahkan fungsi baru untuk memisahkan logika
function setupReviewForm(restaurant) {
  return new Promise((resolve) => {
    const reviewForm = document.getElementById('reviewForm');
    const nameInput = document.getElementById('name');
    const reviewInput = document.getElementById('review');
    const submitButton = reviewForm.querySelector('.submit-review-button');
    const successMessage = document.getElementById('reviewSuccess');
    const errorMessage = document.getElementById('reviewError');
    const reviewsContainer = document.querySelector('.reviews');

    function validateForm() {
      const isNameValid = nameInput.value.length >= 3;
      const isReviewValid = reviewInput.value.length >= 10;
      submitButton.disabled = !(isNameValid && isReviewValid);
    }

    nameInput.addEventListener('input', validateForm);
    reviewInput.addEventListener('input', validateForm);

    reviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      submitButton.disabled = true;
      submitButton.textContent = 'Mengirim...';

      try {
        const response = await fetch('https://restaurant-api.dicoding.dev/review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: restaurant.id,
            name: nameInput.value,
            review: reviewInput.value,
          }),
        });

        const result = await response.json();

        if (result.error) {
          throw new Error(result.message);
        }

        // Tambahkan review baru ke daftar ulasan
        const newReview = {
          name: nameInput.value,
          review: reviewInput.value,
          date: new Date().toLocaleDateString('id-ID'),
        };

        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-card';
        reviewElement.innerHTML = `
          <h4>${newReview.name}</h4>
          <p class="review-date">${newReview.date}</p>
          <p class="review-text">${newReview.review}</p>
        `;

        reviewsContainer.insertBefore(reviewElement, reviewsContainer.firstChild);

        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        reviewForm.reset();

        // Sembunyikan pesan sukses setelah 3 detik
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 3000);
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Kirim Ulasan';
      }
    });
    resolve();
  });
}

// Fungsi untuk mengatur tombol favorit - tambahkan fungsi baru untuk memisahkan logika
function setupFavoriteButton(restaurant) {
  return new Promise((resolve) => {
    const favoriteButton = document.getElementById('favoriteButton');
    favoriteButton.addEventListener('click', () => handleFavoriteButtonClick(restaurant));
    resolve();
  });
}

// Fungsi untuk menangani klik tombol favorit
export async function handleFavoriteButtonClick(restaurant) {
  try {
    const db = await dbPromise;
    const tx = db.transaction('restaurants', 'readwrite');
    const store = tx.objectStore('restaurants');
    const isFavorited = await store.get(restaurant.id);

    const favoriteButton = document.getElementById('favoriteButton');

    if (isFavorited) {
      await store.delete(restaurant.id);
      favoriteButton.textContent = 'Tambahkan ke Favorit';
    } else {
      await store.put(restaurant, restaurant.id);
      favoriteButton.textContent = 'Hapus dari Favorit';
    }

    await tx.done;
  } catch (error) {
    console.error('Error handling favorite button:', error);
  }
}