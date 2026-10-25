// ---- Store settings: edit these before publishing ----
export const WHATSAPP_NUMBER = "918407913008"; // country code + number
export const SHIPPING_FEE = 0;                 // flat shipping in ₹ (0 = free)
export const MAX_QTY = 20;
export const LOGO = "logo.png"; // file name in /public ("" = show the MN circle)
export const PRODUCT = {
  id: "soap",
  name: "Madhuri Naturals Handmade Soap",
  price: 100,
  weight: "125 g",
  // Put photos in /public and list the file names here
  images: ["soap-1.png", "soap-2.png"],
  ingredients: [
    "Masoor Dal", "Bengal Gram", "Coffee", "Turmeric", "Sandalwood",
    "Almond", "Cashew", "Rice", "Sesame", "Clove", "Soap Base", "Natural Fragrance",
  ],
};

// Candles from your sheet. pieces = the number from the 2nd column; price = 3rd column.
// Add "image: 'rose.jpg'" (file in /public) to show a photo instead of the colour tile.

export const CANDLES = [
  { id: "c-rose",       name: "Rose",                price: 49, tone: "#f6c9d0", images: ["candle_rose-1.jpg", "candle_rose-2.jpg"] },
  { id: "c-rose-combo", name: "Rose Combo (Same) S", price: 199,  tone: "#efd9d2", images: ["candle_s_rose_combo-1.jpg", "candle_s_rose_combo-2.jpg"] },
  { id: "c-rose-b",     name: "Rose B",              price: 249,  tone: "#f7c6a8", images: ["candle_rose_b-1.jpg", "candle_rose_b-2.jpg"] },
  { id: "c-lotus",      name: "Lotus",               price: 59,  tone: "#f9e19a", images: ["candle_lotus-1.jpg", "candle_lotus-2.jpg"] },
  { id: "c-lotus-b",    name: "Lotus B",             price: 199, tone: "#c9e6b8", images: ["candle_lotus_b-1.jpg", "candle_lotus_b-2.jpg"] },
  { id: "c-diff-combo", name: "Rose Combo (Diff) S", price: 199, tone: "#bcdcf2", images: ["candle_s_rose_diff_combo-1.jpg", "candle_s_rose_diff_combo-2.jpg"] },
];


export const HAMPER = {
  id: "hamper",
  title: "Diwali Gift Hamper",
  tagline: "Share the glow this Diwali with handmade natural care.",
  price: 499,
  items: ["Madhuri Naturals Handmade Soap × 3", "Festive gift box packing", "Handwritten greeting card"],
  note: "Limited stock. Order early for Diwali delivery.",
  images: ["gift_hamper.jpg"]
};

// SAMPLE reviews: replace with your customers' real reviews, then delete "sample: true".
export const REVIEWS = [
  { name: "Customer name", place: "City", rating: 5, text: "Write your customer's real review here.", sample: true },
  { name: "Customer name", place: "City", rating: 5, text: "Paste a genuine message from WhatsApp or Instagram.", sample: true },
  { name: "Customer name", place: "City", rating: 4, text: "Three to six reviews look best on the page.", sample: true },
];

export const CATALOG = [
  { id: PRODUCT.id, name: PRODUCT.name, price: PRODUCT.price, sub: PRODUCT.weight },
  ...CANDLES.map((c) => ({ id: c.id, name: `${c.name} Candle`, price: c.price, sub: "Candle" })),
  { id: HAMPER.id, name: HAMPER.title, price: HAMPER.price, sub: "Gift box" },
];

export const REVIEW_FORM_URL = "https://forms.gle/Q5UskUYvZL6EQfky7"; 
export const REVIEWS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWLQ2atmwDqU3K1w-vwnD5JVphjXhWHKbdufjANFZAR87mIhgnl4yB0_IECCrJLeRfzb-1DSMytI_W/pub?gid=156608&single=true&output=csv"; // paste the published CSV link here

export const WHOLESALE = {
  title: "Wholesale & bulk orders",
  text: "Buying for your shop, salon, gifting or events? Our soaps and candles are available at wholesale prices.",
  points: ["Soaps and candles in bulk", "Pan-India delivery", "Message us for wholesale rates"],
};

export const CONTACT = {
  email: "madhuriy17@gmail.com",      // e.g. "hello@example.com" (leave "" to hide)
  instagram: "https://instagram.com/madhuri__creations",  // e.g. "https://instagram.com/yourpage"
  address: "Pune",    // e.g. "Nagpur, Maharashtra"
  hours: "10AM–8PM",      // e.g. "Mon–Sat, 10am–7pm"
};

export const inr = (n) => `₹${n.toLocaleString("en-IN")}`;
