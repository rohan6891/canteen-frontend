const PDFDocument = require('pdfkit');

const generatePDF = async (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Header
      doc.fontSize(20).text('Canteen Order Receipt', 50, 50);
      doc.fontSize(12).text(`Order ID: ${order.orderId}`, 50, 80);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 95);
      doc.text(`Time: ${new Date(order.createdAt).toLocaleTimeString()}`, 50, 110);
      
      if (order.studentName !== 'Anonymous') {
        doc.text(`Student: ${order.studentName}`, 50, 125);
      }
      
      if (order.rollNumber) {
        doc.text(`Roll Number: ${order.rollNumber}`, 50, 140);
      }

      // Order items
      let yPosition = 170;
      doc.text('Order Items:', 50, yPosition);
      yPosition += 20;

      order.items.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.name}`, 70, yPosition);
        doc.text(`   Qty: ${item.quantity} × ₹${item.price} = ₹${item.subtotal}`, 70, yPosition + 12);
        yPosition += 30;
      });

      // Total
      yPosition += 10;
      doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`, 50, yPosition);
      doc.fontSize(12).text(`Payment Method: ${order.paymentMethod}`, 50, yPosition + 20);
      doc.text(`Status: ${order.status}`, 50, yPosition + 35);
      
      if (order.estimatedTime) {
        doc.text(`ETA: ${new Date(order.estimatedTime).toLocaleTimeString()}`, 50, yPosition + 50);
      }

      // QR Code (if available)
      if (order.qrCode) {
        const qrBuffer = Buffer.from(order.qrCode.split(',')[1], 'base64');
        doc.image(qrBuffer, 400, yPosition - 50, { width: 100 });
        doc.text('Scan QR to track order', 400, yPosition + 60);
      }

      // Footer
      doc.text('Thank you for your order!', 50, yPosition + 80);
      doc.text('Please show this receipt when collecting your order.', 50, yPosition + 95);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };