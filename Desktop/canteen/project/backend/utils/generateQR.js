const QRCode = require('qrcode');

const generateQRCode = async (text) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      type: 'image/png',
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw error;
  }
};

module.exports = { generateQRCode };