const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const { createCanvas } = require('canvas');
const csv = require('csv-parser');

// Directory to save QR codes
const qrDir = path.join(__dirname, 'qr_codes');
if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir);
}

// Conversion factor for 2.5 cm in pixels at 300 DPI
const cmToPixels = 118.11;
const qrSize = Math.round(2.5 * cmToPixels);  // ~295 pixels for 2.5 cm
const textHeight = Math.round(1 * cmToPixels); // ~118 pixels for text and margin

// Read data from the CSV file
fs.createReadStream(path.join(__dirname, 'data.csv'))
  .pipe(csv())
  .on('data', (row) => {
    const id = row.Nr;
    const firstName = row.FirstName;
    const lastName = row.LastName;
    const organisation = row.Organisation;

    // Prepare the QR code content
    const qrData = JSON.stringify({ id, firstName, lastName, organisation });

    const canvas = createCanvas(qrSize, qrSize + textHeight);
    const ctx = canvas.getContext('2d');

    // Generate QR code
    QRCode.toCanvas(canvas, qrData, {
        errorCorrectionLevel: 'H',
        width: qrSize,
    }, (err) => {
        if (err) throw err;

        // Add the name under the QR code
        ctx.font = `${Math.round(0.4 * cmToPixels)}px Arial`; // Font size about 0.4 cm
        ctx.textAlign = 'center';
        ctx.fillText(id + '_' + firstName + lastName, canvas.width / 2, qrSize + Math.round(0.3 * cmToPixels)); // Position text under the QR code

        // Save the image
        const fileName = id + '_' + firstName + '_' + lastName + '.png';
        const filePath = path.join(qrDir, fileName);
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);

        console.log(`QR code for ${firstName} saved as ${fileName}`);
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
