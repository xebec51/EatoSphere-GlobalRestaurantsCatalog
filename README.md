# **EatoSphere - Global Restaurants Catalog**  
Submission untuk Kelas **Menjadi Front-End Web Developer Expert** di Dicoding.

---

## **Deskripsi Proyek**
EatoSphere adalah aplikasi web yang dirancang untuk menampilkan katalog restoran dari seluruh dunia. Aplikasi ini memungkinkan pengguna untuk:
- Menjelajahi daftar restoran dengan informasi lengkap.
- Menyimpan restoran favorit untuk akses mudah.
- Mengakses aplikasi secara offline dengan fitur Progressive Web App (PWA).
- Menambahkan aplikasi ke layar utama perangkat melalui fitur **Add to Home Screen**.

🌐 **Link Website**: [https://eatosphere.netlify.app](https://eatosphere.netlify.app)

---

## **Fitur Utama**
### **1. Halaman Utama**
- Menampilkan daftar restoran dari berbagai lokasi.
- Informasi dasar seperti nama restoran, kota, rating, dan deskripsi singkat.

### **2. Halaman Detail**
- Informasi lengkap tentang restoran, termasuk menu makanan dan minuman.
- Ulasan pelanggan untuk memberikan gambaran pengalaman orang lain.

### **3. Halaman Favorit**
- Menampilkan restoran yang ditambahkan ke daftar favorit pengguna.
- Memungkinkan pengguna untuk menghapus restoran dari daftar favorit.

### **4. Offline Capability (PWA)**
- Mendukung akses offline menggunakan Service Worker.
- Aplikasi tetap berfungsi meskipun tanpa koneksi internet.

### **5. Add to Home Screen**
- Memungkinkan pengguna untuk menginstal aplikasi di layar utama perangkat.

---

## **Teknologi yang Digunakan**
- **HTML, CSS, dan JavaScript**: Teknologi utama untuk pengembangan frontend.
- **Webpack**: Untuk bundling aset dan optimasi kode.
- **Workbox**: Untuk menerapkan fitur PWA.
- **IndexedDB**: Untuk menyimpan data favorit secara offline.
- **Jest**: Untuk pengujian unit.
- **Playwright**: Untuk pengujian end-to-end.
- **Imagemin dan WebP**: Untuk optimasi gambar.

---

## **Cara Menjalankan Proyek**
### **Prasyarat**
- **Node.js** (versi >= 18) dan **npm** (versi >= 8).
- **Git** untuk mengelola repository.

### **Langkah-Langkah**
1. Clone repository ini:
   ```bash
   git clone https://github.com/xebec51/Submission-Menjadi-Front-End-Web-Developer-Expert-Dicoding.git
   ```
2. Buka folder proyek:
   ```bash
   cd Submission-Menjadi-Front-End-Web-Developer-Expert-Dicoding
   ```
3. Instal semua dependensi:
   ```bash
   npm install
   ```
4. Jalankan server pengembangan:
   ```bash
   npm run start-dev
   ```
5. Buka aplikasi di browser:
   [http://localhost:8080](http://localhost:8080)

---

## **Build untuk Production**
1. Jalankan perintah berikut untuk mem-build aplikasi:
   ```bash
   npm run build
   ```
2. File hasil build akan berada di folder `dist`.

---

## **Pengujian**
### **Unit Testing**
- Jalankan pengujian unit menggunakan Jest:
  ```bash
  npm test
  ```

### **End-to-End Testing**
- Jalankan pengujian E2E menggunakan Playwright:
  ```bash
  npm run e2e
  ```

---

## **Kontributor**
- **Muh. Rinaldi Ruslan**  
  - Email: [rinaldi.ruslan51@gmail.com](mailto:rinaldi.ruslan51@gmail.com)  
  - LinkedIn: [Muh. Rinaldi Ruslan](https://linkedin.com/in/rinaldiruslan)  
  - GitHub: [xebec51](https://github.com/xebec51)

---

## **Lisensi**
Proyek ini menggunakan lisensi [ISC](LICENSE).
```