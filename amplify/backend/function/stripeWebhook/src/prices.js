//REMEMBER TO UPDATE THE CORRESPONDING PRICES FOR STRIPE WEBHOOK!!

const prices = {
  "10": 199,
  "50": 999,
  "100": 1799,
  "150": 2499,
  "500": 7499,
  "1000": 15000,
};

const conversionRate = 10;

module.exports = {
  prices,
  conversionRate,
};
