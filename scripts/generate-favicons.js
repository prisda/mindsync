import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'favicon.ico': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
  'mstile-150x150.png': 150
};

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#2563EB"/>
  <path d="M362.667 64a60.8 60.373 0 1 1 85.333 85.333L160 405.333 42.667 469.333l32-117.333L362.667 64z" stroke="white" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="m320 106.667 85.333 85.333" stroke="white" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

async function generateFavicons() {
  // Ensure public directory exists
  await fs.mkdir('public', { recursive: true });

  // Save the SVG file
  await fs.writeFile('public/favicon.svg', svg);

  // Generate PNGs for each size
  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join('public', filename));
  }

  console.log('Favicons generated successfully!');
}

generateFavicons().catch(console.error);