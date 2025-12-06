const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const publicDir = path.join(projectRoot, 'public');
  const iconsDir = path.join(publicDir, 'icons');
  const sourceCandidates = [
    path.join(publicDir, 'logo.png'),
    path.join(projectRoot, 'digihealth-logo.png')
  ];

  const src = sourceCandidates.find(p => fs.existsSync(p));
  if (!src) {
    console.error('Source logo not found. Place digihealth-logo.png or public/logo.png.');
    process.exit(1);
  }

  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir);

  const brandBg = { r: 0, g: 147, b: 233, alpha: 1 };
  const tasks = [
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-192.png', size: 192 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-152x152.png', size: 152 },
    { name: 'icon-144x144.png', size: 144 },
    { name: 'icon-120x120.png', size: 120 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'tile-70x70.png', size: 70 },
    { name: 'tile-150x150.png', size: 150 },
    { name: 'tile-310x310.png', size: 310 },
  ];

  for (const t of tasks) {
    const out = path.join(iconsDir, t.name);
    await sharp(src)
      .resize(t.size, t.size, { fit: 'contain', background: brandBg })
      .png()
      .toFile(out);
    console.log('Generated', out);
  }

  console.log('All icons generated at', iconsDir);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
