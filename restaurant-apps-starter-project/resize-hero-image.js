import sharp from 'sharp';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';

const inputDir = path.resolve('src/public/images/heros');
const outputDir = path.resolve('src/public/images/heros');

// Pastikan outputDir ada
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const inputImage = 'hero-image_1.jpg';

// Gambar resolusi kecil
sharp(path.join(inputDir, inputImage))
  .resize(480) // Ubah ukuran lebar menjadi 480px
  .toFile(path.join(outputDir, 'hero-image-small.jpg'))
  .then(() => console.log('Gambar kecil berhasil dibuat.'))
  .catch((err) => console.error('Gagal membuat gambar kecil:', err));

// Gambar resolusi besar
sharp(path.join(inputDir, inputImage))
  .resize(1920) // Ubah ukuran lebar menjadi 1920px
  .toFile(path.join(outputDir, 'hero-image-large.jpg'))
  .then(() => console.log('Gambar besar berhasil dibuat.'))
  .catch((err) => console.error('Gagal membuat gambar besar:', err));
