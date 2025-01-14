import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Direktori file pengujian
  testDir: './tests/e2e', // Sesuaikan dengan lokasi file pengujian Anda
  testMatch: '**/*.test.js', // Jalankan hanya file dengan ekstensi .test.js
  timeout: 60000, // Timeout maksimum untuk setiap pengujian
  retries: 2, // Ulangi pengujian hingga 2 kali jika gagal
  use: {
    headless: true, // Jalankan browser dalam mode headless
    baseURL: 'http://localhost:8080', // Base URL untuk aplikasi Anda
    video: 'on-first-retry', // Rekam video hanya pada pengulangan pertama
    screenshot: 'only-on-failure', // Ambil screenshot hanya jika pengujian gagal
    viewport: { width: 1280, height: 720 }, // Ukuran viewport default
    ignoreHTTPSErrors: true, // Abaikan kesalahan HTTPS jika ada
  },
  expect: {
    timeout: 5000, // Timeout per assertion (ms)
  },
  fullyParallel: true, // Jalankan pengujian secara paralel
  workers: 4, // Maksimum jumlah worker
  reporter: [['list'], ['html', { outputFolder: 'test-results' }]], // Gunakan reporter bawaan dan laporan HTML
});
