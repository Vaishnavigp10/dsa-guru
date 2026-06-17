import sharp from 'sharp'
import fs from 'fs'

const svgContent = fs.readFileSync('./public/favicon.svg')

await sharp(svgContent)
  .resize(192, 192)
  .png()
  .toFile('./public/icon-192.png')

await sharp(svgContent)
  .resize(512, 512)
  .png()
  .toFile('./public/icon-512.png')

console.log('✅ Icons generated successfully!')