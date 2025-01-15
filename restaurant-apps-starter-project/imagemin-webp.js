import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import path from 'path';
import fs from 'fs/promises';

async function optimizeImages() {
  try {
    const inputDir = 'src/public/images';
    const outputDir = 'src/public/images/optimized';

    // Pastikan folder output ada
    await fs.mkdir(outputDir, { recursive: true });

    // Jalankan optimasi gambar
    const files = await imagemin([`${inputDir}/**/*.{jpg,png}`], {
      destination: outputDir,
      plugins: [
        imageminWebp({
          quality: 30, // Menurunkan kualitas untuk ukuran lebih kecil
        }),
      ],
    });

    // Log hasil optimasi
    console.log(`Optimasi selesai. ${files.length} file telah dioptimalkan.`);
    files.forEach((file) => {
      console.log(`- ${file.destinationPath}`);
    });
  } catch (error) {
    console.error('Terjadi kesalahan saat optimasi gambar:', error);
  }
}

// Jalankan fungsi optimasi
optimizeImages();
