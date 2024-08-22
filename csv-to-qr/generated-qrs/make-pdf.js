const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const { createCanvas, loadImage } = require('canvas');
const csv = require('csv-parser');

// Directory where QR codes are saved
const qrDir = path.join(__dirname, 'qr_codes');
const pdfOutputPath = path.join(__dirname, 'qr_codes.pdf');

// Conversion factor for 2.5 cm in pixels at 300 DPI
const cmToPixels = 118.11;
const qrSize = Math.round(2.5 * cmToPixels);  // ~295 pixels for 2.5 cm
const textHeight = Math.round(0.6 * cmToPixels); // ~71 pixels for text and margin

// Adding extra space for cutting
const topMargin = Math.round(0.5 * cmToPixels); // 0.5 cm above the text
const bottomMargin = Math.round(0.5 * cmToPixels); // 0.5 cm below the QR code and text

// Set up PDF page dimensions (A4 size 210mm x 297mm)
const pageWidth = Math.round(210 * cmToPixels / 10);  // 210mm
const pageHeight = Math.round(297 * cmToPixels / 10);  // 297mm

// Number of QR codes per row and column (adjusted for margins)
const qrPerRow = Math.floor(pageWidth / (qrSize + topMargin));
const qrPerCol = Math.floor(pageHeight / (qrSize + textHeight + bottomMargin));

// Create the PDF
const createPDF = async () => {
    const pdfDoc = await PDFDocument.create();

    // Register fontkit with pdf-lib
    pdfDoc.registerFontkit(fontkit);

    // Embed the custom font
    const fontBytes = fs.readFileSync(path.join(__dirname, 'DejaVuSans.ttf'));
    const customFont = await pdfDoc.embedFont(fontBytes);

    // Read all generated QR code files
    const qrFiles = fs.readdirSync(qrDir).filter(file => file.endsWith('.png'));

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let xOffset = topMargin;
    let yOffset = bottomMargin;
    let qrCount = 0;

    for (const fileName of qrFiles) {
        const filePath = path.join(qrDir, fileName);
        const qrImage = await loadImage(filePath);
        const pngImage = await pdfDoc.embedPng(fs.readFileSync(filePath));

        // Draw the QR code on the PDF
        page.drawImage(pngImage, {
            x: xOffset,
            y: pageHeight - yOffset - qrSize - bottomMargin,
            width: qrSize,
            height: qrSize,
        });

        // Draw the name under the QR code
        page.drawText(fileName.replace(/_/g, ' ').replace('.png', ''), {
            x: xOffset + qrSize / 2,
            y: pageHeight - yOffset - qrSize - textHeight, // Adjusted y position for text
            size: 6, // Set font size to 6 points for better readability
            color: rgb(0, 0, 0),
            font: customFont,
            opacity: 0.75,
            lineHeight: 12,
            align: 'center',
        });

        qrCount++;
        xOffset += qrSize + topMargin;

        // Move to the next row if necessary
        if (qrCount % qrPerRow === 0) {
            xOffset = topMargin;
            yOffset += qrSize + textHeight + bottomMargin;

            // Move to a new page if necessary
            if (qrCount % (qrPerRow * qrPerCol) === 0) {
                page = pdfDoc.addPage([pageWidth, pageHeight]);
                xOffset = topMargin;
                yOffset = bottomMargin;
            }
        }
    }

    // Save the PDF to a file
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfOutputPath, pdfBytes);

    console.log(`PDF generated: ${pdfOutputPath}`);
};

// Execute the PDF creation function
createPDF().catch(console.error);
