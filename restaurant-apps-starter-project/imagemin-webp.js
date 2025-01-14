import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';

async function optimizeImages() {
  try {
    const files = await imagemin(['src/public/images/**/*.{jpg,png}'], {
      destination: 'src/public/images/optimized',
      plugins: [
        imageminWebp({
          quality: 30, // Menurunkan kualitas untuk ukuran lebih kecil
        }),
      ],
    });
    console.log('Optimasi selesai. File yang dioptimalkan:', files);
  } catch (error) {
    console.error('Terjadi kesalahan saat optimasi gambar:', error);
  }
}

// Jalankan fungsi optimasi
optimizeImages();
