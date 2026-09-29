import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, Minus, Plus, X, CheckCircle2, MessageCircle, Sparkles, Leaf, Truck, Trash2 } from "lucide-react";
import Gallery from "./Gallery.jsx";
import Modal from "./Modal.jsx";

import { PRODUCT, WHATSAPP_NUMBER, SHIPPING_FEE, MAX_QTY, inr } from "./config.js";

const EMPTY_FORM = { name: "", phone: "", address: "", pincode: "" };
const CART_KEY = "mn-cart-qty";

const validate = (f) => {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[6-9]\d{9}$/.test(f.phone)) e.phone = "Enter a valid 10-digit Indian mobile number.";
  if (f.address.trim().length < 10) e.address = "Please add house/flat, street, area and city.";
  if (!/^[1-9]\d{5}$/.test(f.pincode)) e.pincode = "Enter a valid 6-digit pincode.";
  return e;
};

function loadCart() {
  try {
    const n = parseInt(localStorage.getItem(CART_KEY), 10);
    return Number.isInteger(n) && n > 0 ? Math.min(n, MAX_QTY) : 0;
  } catch { return 0; }
}

function QtyControl({ value, onChange, size = 17, min = 1 }) {
  return (
    <div className="quantity">
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity"><Minus size={size} /></button>
      <strong aria-live="polite">{value}</strong>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity"><Plus size={size} /></button>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label>
      {label}
      {children}
      {error && <span className="field-error" role="alert">{error}</span>}
    </label>
  );
}

export default function App() {
  const [selQty, setSelQty] = useState(1);
  const [cartQty, setCartQty] = useState(loadCart);
  const [panel, setPanel] = useState(null); // null | "cart" | "checkout"
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(CART_KEY, String(cartQty)); } catch { /* storage unavailable */ }
  }, [cartQty]);

  const clamp = (n) => Math.max(1, Math.min(MAX_QTY, n));
  const subtotal = PRODUCT.price * cartQty;
  const total = subtotal + (cartQty ? SHIPPING_FEE : 0);
  const close = () => setPanel(null);

  const addToCart = () => {
    setCartQty((q) => Math.min(MAX_QTY, q + selQty));
    setPanel("cart");
  };
  const buyNow = () => {
    setCartQty(selQty);
    setPanel("checkout");
  };
  const closeCheckout = () => {
    if (order) { setOrder(null); setForm(EMPTY_FORM); }
    close();
  };

  const setField = (key, transform = (v) => v) => (e) => {
    const value = transform(e.target.value);
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };
  const digits = (max) => (v) => v.replace(/\D/g, "").slice(0, max);

  const placeOrder = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.querySelector(".checkout [aria-invalid='true']")?.focus();
      return;
    }
    setOrder({
      id: `MN${Date.now().toString(36).toUpperCase().slice(-6)}`,
      qty: cartQty,
      total,
      customer: form,
    });
    setCartQty(0);
  };

  const sendWhatsApp = () => {
    const { id, qty, total: t, customer: c } = order;
    const text = [
      "Hello Madhuri Naturals! I want to order:", "",
      `Order ref: ${id}`,
      `${PRODUCT.name} (${PRODUCT.weight})`,
      `Quantity: ${qty}`,
      `Total: ${inr(t)}${SHIPPING_FEE ? ` (incl. shipping ${inr(SHIPPING_FEE)})` : ""}`, "",
      `Name: ${c.name.trim()}`,
      `Phone: ${c.phone}`,
      `Address: ${c.address.trim()}`,
      `Pincode: ${c.pincode}`,
    ].join("\n");
    const base = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/";
    window.open(`${base}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const ingredientItems = useMemo(
    () => PRODUCT.ingredients.map((item) => (
      <li className="ingredient" key={item}><span className="dot" aria-hidden="true" />{item}</li>
    )), []
  );

const photos = PRODUCT.images.map((f) => `${import.meta.env.BASE_URL}${f}`);
const img = photos[0];
  return (
    <div className="app">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="navbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">MN</div>
          <div>
            <div className="brand-name">MADHURI NATURALS</div>
            <div className="brand-tag">Handmade • Natural • Care</div>
          </div>
        </div>
        <button className="cart-button" onClick={() => setPanel("cart")} aria-label={`Open cart, ${cartQty} item${cartQty === 1 ? "" : "s"}`}>
          <ShoppingBag size={20} />
          <span>Cart</span>
          {cartQty > 0 && <b>{cartQty}</b>}
        </button>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><Sparkles size={15} /> HANDMADE SOAP</span>
            <h1>Natural care,<br /><em>made by hand.</em></h1>
            <p className="intro">
              A thoughtfully crafted handmade soap made with a blend of traditional
              ingredients and natural fragrance.
            </p>

            <div className="price-row">
              <span className="price">{inr(PRODUCT.price)}</span>
              <span className="weight">{PRODUCT.weight}</span>
            </div>

            <div className="qty-row">
              <span>Quantity</span>
              <QtyControl value={selQty} onChange={(n) => setSelQty(clamp(n))} />
            </div>

            <div className="actions">
              <button className="primary" onClick={addToCart}><ShoppingBag size={19} /> Add to Cart</button>
              <button className="secondary" onClick={buyNow}>Buy Now</button>
            </div>

            <ul className="trust-row">
              <li><Leaf size={18} /><span>Handmade</span></li>
              <li><Sparkles size={18} /><span>Natural fragrance</span></li>
              <li><Truck size={18} /><span>Pan-India shipping</span></li>
            </ul>
          </div>

          <div className="product-visual">
            {/* <div className="blob" /> */}
            {photos.length ? (
  <Gallery photos={photos} name={PRODUCT.name} />
) : (
              <div className="product-placeholder">
                <div className="placeholder-inner">
                  <span>YOUR SOAP PHOTO</span>
                  <small>Set <code>PRODUCT.image</code> in src/config.js</small>
                </div>
              </div>
            )}
            <div className="floating-card"><span>{PRODUCT.weight}</span><small>{inr(PRODUCT.price)}</small></div>
          </div>
        </section>

        <section className="ingredients-section">
          <div className="section-heading">
            <span className="eyebrow">WHAT'S INSIDE</span>
            <h2>Ingredients chosen for your soap</h2>
            <p>Replace or update this list anytime in src/config.js.</p>
          </div>
          <ul className="ingredient-grid">{ingredientItems}</ul>
        </section>

        <section className="order-strip">
          <div>
            <span className="eyebrow">READY TO ORDER?</span>
            <h2>Bring Madhuri Naturals home.</h2>
          </div>
          <button className="primary light" onClick={buyNow}>Order Now →</button>
        </section>
      </main>

      <footer>
        <strong>MADHURI NATURALS</strong>
        <span>Handmade soap • {PRODUCT.weight} • {inr(PRODUCT.price)}</span>
      </footer>

      {panel === "cart" && (
        <Modal onClose={close} label="Your cart" className="drawer">
          <div className="drawer-head">
            <h2>Your Cart</h2>
            <button onClick={close} aria-label="Close cart"><X /></button>
          </div>
          {cartQty === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <button className="secondary" onClick={close}>Continue shopping</button>
            </div>
          ) : (
            <>
              <div className="cart-item">
                <div className="mini-photo">{img ? <img src={img} alt="" /> : "MN"}</div>
                <div className="item-info">
                  <strong>{PRODUCT.name}</strong>
                  <span>{PRODUCT.weight} • {inr(PRODUCT.price)} each</span>
                  <div className="item-actions">
                    <QtyControl value={cartQty} onChange={(n) => setCartQty(Math.max(1, Math.min(MAX_QTY, n)))} size={15} />
                    <button className="icon-text" onClick={() => setCartQty(0)} aria-label="Remove from cart"><Trash2 size={15} /> Remove</button>
                  </div>
                </div>
              </div>
              <div className="total-lines">
                <div><span>Subtotal</span><span>{inr(subtotal)}</span></div>
                <div><span>Shipping</span><span>{SHIPPING_FEE ? inr(SHIPPING_FEE) : "Free"}</span></div>
                <div className="grand"><span>Total</span><strong>{inr(total)}</strong></div>
              </div>
              <button className="primary full" onClick={() => setPanel("checkout")}>Proceed to Checkout</button>
            </>
          )}
        </Modal>
      )}

      {panel === "checkout" && (
        <Modal onClose={closeCheckout} label="Checkout" className="checkout">
          <div className="drawer-head">
            <div>
              <span className="eyebrow">CHECKOUT</span>
              <h2>Complete your order</h2>
            </div>
            <button onClick={closeCheckout} aria-label="Close checkout"><X /></button>
          </div>

          {order ? (
            <div className="success">
              <CheckCircle2 size={58} />
              <h2>Order details received!</h2>
              <p className="order-ref">Order ref: <strong>{order.id}</strong></p>
              <p>Send the order details on WhatsApp so we can confirm payment and shipping with you.</p>
              <button className="primary full" onClick={sendWhatsApp}><MessageCircle size={19} /> Send Order on WhatsApp</button>
              <button className="text-button" onClick={closeCheckout}>Close</button>
            </div>
          ) : cartQty === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <button className="secondary" onClick={close}>Continue shopping</button>
            </div>
          ) : (
            <form onSubmit={placeOrder} noValidate>
              <div className="summary">
                <span>{PRODUCT.name} × {cartQty}</span><strong>{inr(total)}</strong>
              </div>
              <Field label="Name" error={errors.name}>
                <input value={form.name} onChange={setField("name")} placeholder="Your full name" autoComplete="name" aria-invalid={!!errors.name} />
              </Field>
              <Field label="Mobile number" error={errors.phone}>
                <input value={form.phone} onChange={setField("phone", digits(10))} placeholder="10-digit mobile number" inputMode="numeric" autoComplete="tel-national" aria-invalid={!!errors.phone} />
              </Field>
              <Field label="Delivery address" error={errors.address}>
                <textarea value={form.address} onChange={setField("address")} placeholder="House / Flat, Street, Area, City" autoComplete="street-address" aria-invalid={!!errors.address} />
              </Field>
              <Field label="Pincode" error={errors.pincode}>
                <input value={form.pincode} onChange={setField("pincode", digits(6))} placeholder="6-digit pincode" inputMode="numeric" autoComplete="postal-code" aria-invalid={!!errors.pincode} />
              </Field>
              <div className="payment-note">Payment is confirmed with you on WhatsApp. Online payment (UPI) can be added later.</div>
              <button className="primary full" type="submit">Confirm Order · {inr(total)}</button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
