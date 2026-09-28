// ---- Store settings: edit these before publishing ----
export const WHATSAPP_NUMBER = "918407913008"; // country code + number, e.g. "919876543210"
export const SHIPPING_FEE = 0;     // flat shipping in ₹ (0 = free)
export const MAX_QTY = 20;

export const PRODUCT = {
  name: "Madhuri Naturals Handmade Soap",
  price: 100,
  weight: "125 g",
  images: [
     "soap-1.png",
     "soap-2.png"
   ], // e.g. "soap.jpg" after placing the file in /public
  ingredients: [
    "Masoor Dal", "Bengal Gram", "Coffee", "Turmeric", "Sandalwood",
    "Almond", "Cashew", "Rice", "Sesame", "Clove", "Soap Base", "Natural Fragrance",
  ],
};

export const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
