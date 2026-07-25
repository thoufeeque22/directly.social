/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buffer = Buffer.from(base64Png, 'base64');

function writeIfMissing(targetPath) {
  if (!fs.existsSync(targetPath)) {
    fs.writeFileSync(targetPath, buffer);
    console.log(`Wrote placeholder image to ${targetPath}`);
  } else {
    console.log(`Placeholder image already exists at ${targetPath}`);
  }
}

const logoPath = path.join(__dirname, '../public/logo.png');
const ogImagePath = path.join(__dirname, '../public/og-image.png');

writeIfMissing(logoPath);
writeIfMissing(ogImagePath);
