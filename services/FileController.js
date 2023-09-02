const sharp = require('sharp');

async function convertToWebP(inputPath, outputPath) {
    try {
        await sharp(inputPath)
        .toFormat('webp')
        .toFile(outputPath);
    } catch (error) {
        console.error('Error converting image to WebP:', error);
    }
}

module.exports = {
    convertToWebP
}