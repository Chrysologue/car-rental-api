function generateBookingNumber() {
  return 'BK' + Date.now() + Math.floor(Math.random() * 1000);
}

module.exports = generateBookingNumber;
