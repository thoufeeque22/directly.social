/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buffer = Buffer.from(base64Png, 'base64');

fs.writeFileSync(path.join(__dirname, '../public/logo.png'), buffer);
fs.writeFileSync(path.join(__dirname, '../public/og-image.png'), buffer);
console.log('Successfully wrote placeholder PNG images.');
