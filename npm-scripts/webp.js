const imagemin = require('imagemin'); // The imagemin module.
const webp = require('imagemin-webp'); // imagemin's WebP plugin.

const outputFolder = '../public/images/'; // Output folder
const PNGImages = '../src/images/*.png'; // PNG images
const JPEGImages = '../src/images/*.jpg'; // JPEG images

imagemin([PNGImages], outputFolder, {
  plugins: [webp({
    lossless: true // Losslessly encode images
  })]
});

imagemin([JPEGImages], outputFolder, {
  plugins: [webp({
    quality: 65 // Quality setting from 0 to 100
  })]
});
