# Madhuri Naturals – Handmade Soap Website

## Included
- React + Vite single-product storefront
- Madhuri Naturals branding
- Product: Handmade Soap
- Price: ₹100
- Weight: 125 g
- Ingredients section
- Quantity selector
- Real cart (persists across reloads), accessible drawer/dialogs
- Checkout form with Indian mobile/pincode validation
- WhatsApp order handoff
- Placeholder for your soap photo
- Mobile responsive design

## Run locally
```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Before publishing
All store settings live in `src/config.js`.
1. Put your photo in `/public` and set `PRODUCT.image` (e.g. `"soap.jpg"`).
2. Set `WHATSAPP_NUMBER` (country code + number, e.g. `919876543210`).
3. Add your UPI ID / payment integration if you want online payment.
4. Add shipping charges or free-shipping rules.
5. Add legal/contact details and any required product/label information.

## Backend
This starter version does **not** need a backend just to show the product and collect an order request. The form currently hands the order to WhatsApp.

For automatic online payments, order storage, admin order management, inventory, customer accounts, and automatic courier/tracking updates, a backend or a commerce/payment service should be added later.
