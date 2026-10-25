import { useEffect, useState } from "react";
import {
  ShoppingBag,
  Minus,
  Plus,
  X,
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Leaf,
  Truck,
  Trash2,
  Flame,
  Gift,
  Star,
  Phone, Mail, MapPin, Store
} from "lucide-react";
import Modal from "./Modal.jsx";
import Gallery from "./Gallery.jsx";
import useReviews from "./useReviews.js";

import {
  PRODUCT,
  CANDLES,
  HAMPER,
  REVIEWS,
  CATALOG,
  WHATSAPP_NUMBER,
  SHIPPING_FEE,
  MAX_QTY,
  inr,
  REVIEW_FORM_URL,
  WHOLESALE,
  CONTACT,LOGO,
  REVIEWS_PAGE_SIZE
} from "./config.js";

const EMPTY_FORM = { name: "", phone: "", address: "", pincode: "" };
const CART_KEY = "mn-cart-v2";

const validate = (f) => {
  const e = {};
  if (f.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[6-9]\d{9}$/.test(f.phone))
    e.phone = "Enter a valid 10-digit Indian mobile number.";
  if (f.address.trim().length < 10)
    e.address = "Please add house/flat, street, area and city.";
  if (!/^[1-9]\d{5}$/.test(f.pincode))
    e.pincode = "Enter a valid 6-digit pincode.";
  return e;
};

function loadCart() {
  try {
    const o = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
    const c = {};
    for (const p of CATALOG) {
      const n = parseInt(o[p.id], 10);
      if (n > 0) c[p.id] = Math.min(n, MAX_QTY);
    }
    return c;
  } catch {
    return {};
  }
}

function QtyControl({ value, onChange }) {
  return (
    <div className="quantity">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus size={15} />
      </button>
      <strong aria-live="polite">{value}</strong>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= MAX_QTY}
        aria-label="Increase quantity"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <label>
      {label}
      {children}
      {error && (
        <span className="field-error" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

const pageFromHash = () => {
  const h = window.location.hash;
  if (h.startsWith("#/candles")) return "candles";
  if (h.startsWith("#/soaps")) return "soaps";
  if (h.startsWith("#/contact")) return "contact";
  if (h.startsWith("#/review")) return "review";
  return "home";
};

export default function App() {
  const [cart, setCart] = useState(loadCart);
  const [panel, setPanel] = useState(null); // null | "cart" | "checkout"
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  const liveReviews = useReviews();
const allReviews = liveReviews.length ? liveReviews : REVIEWS;
const [shown, setShown] = useState(REVIEWS_PAGE_SIZE);
  const [page, setPage] = useState(pageFromHash);
  useEffect(() => {
    const onHash = () => {
      if (!window.location.hash.startsWith("#/")) return;
      setPage(pageFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable */
    }
  }, [cart]);

  const base = import.meta.env.BASE_URL;
  const photos = PRODUCT.images.map((f) => `${base}${f}`);
  const lines = CATALOG.filter((p) => cart[p.id]).map((p) => ({
    ...p,
    qty: cart[p.id],
  }));
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.qty * l.price, 0);
  const total = subtotal + (count ? SHIPPING_FEE : 0);
  const close = () => setPanel(null);

  const setQty = (id, n) =>
    setCart((c) => {
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = Math.min(MAX_QTY, n);
      return next;
    });
  const add = (id) => {
    setQty(id, (cart[id] || 0) + 1);
    setPanel("cart");
  };
  const closeCheckout = () => {
    if (order) {
      setOrder(null);
      setForm(EMPTY_FORM);
    }
    close();
  };

  const setField =
    (key, transform = (v) => v) =>
    (e) => {
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
      lines,
      total,
      customer: form,
    });
    setCart({});
  };

  const [msg, setMsg] = useState({ name: "", text: "" });
const sendContact = (e) => {
  e.preventDefault();
  const text = `Hello Madhuri Naturals!\nName: ${msg.name.trim()}\n\n${msg.text.trim()}`;
  const url = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : "https://wa.me/";
  window.open(`${url}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
};

  const sendWhatsApp = () => {
    const { id, lines: ls, total: t, customer: c } = order;
    const text = [
      "Hello Madhuri Naturals! I want to order:",
      "",
      `Order ref: ${id}`,
      ...ls.map(
        (l) => `• ${l.name} (${l.sub}) × ${l.qty} = ${inr(l.qty * l.price)}`,
      ),
      `Total: ${inr(t)}${SHIPPING_FEE ? ` (incl. shipping ${inr(SHIPPING_FEE)})` : ""}`,
      "",
      `Name: ${c.name.trim()}`,
      `Phone: ${c.phone}`,
      `Address: ${c.address.trim()}`,
      `Pincode: ${c.pincode}`,
    ].join("\n");
    const url = WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER}`
      : "https://wa.me/";
    window.open(
      `${url}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="navbar">
        <a className="brand" href="#/">
          {LOGO ? (
            <img
              className="brand-logo"
              src={`${base}${LOGO}`}
              alt="Madhuri Naturals logo"
              width="46"
              height="46"
            />
          ) : (
            <div className="brand-mark" aria-hidden="true">
              MN
            </div>
          )}
          <div>
            <div className="brand-name">MADHURI NATURALS</div>
            <div className="brand-tag">Handmade • Natural • Care</div>
          </div>
        </a>
        <nav className="nav-links" aria-label="Pages">
          <a href="#/">Home</a>
          <a href="#/soaps">Soaps</a>
          <a href="#/candles">Candles</a>
          <a href="#/contact">Contact</a>
        </nav>
        <button
          className="cart-button"
          onClick={() => setPanel("cart")}
          aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
        >
          <ShoppingBag size={20} />
          <span>Cart</span>
          {count > 0 && <b>{count}</b>}
        </button>
      </header>

      <main id="main">
        <section className="hero" hidden={page !== "home"}>
          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={15} /> HANDMADE IN SMALL BATCHES
            </span>
            <h1>
              Soaps &amp; candles,
              <br />
              <em>made by hand.</em>
            </h1>
            <p className="intro">
              Natural handmade soaps and flower candles from Madhuri Naturals,
              crafted with care for your home and for gifting.
            </p>
            <div className="actions">
              <a className="primary" href="#/candles">
                <Flame size={19} /> Shop Candles
              </a>
              <button className="ghost" onClick={() => add(PRODUCT.id)}>
                Order Soap · {inr(PRODUCT.price)}
              </button>
            </div>
            <ul className="trust-row">
              <li>
                <Leaf size={18} />
                <span>Handmade</span>
              </li>
              <li>
                <Sparkles size={18} />
                <span>Natural fragrance</span>
              </li>
              <li>
                <Truck size={18} />
                <span>Pan-India shipping</span>
              </li>
            </ul>
          </div>
          <div className="hero-visual">
            {photos.length ? (
              <Gallery photos={photos} name={PRODUCT.name} />
            ) : (
              <div className="product-placeholder">
                Add photos in <code>PRODUCT.images</code>
              </div>
            )}
          </div>
        </section>
        <section className="section" hidden={page !== "home"}>
          <div className="category-grid">
            <a className="category-card" href="#/soaps">
              <Leaf size={28} />
              <h3>Handmade Soaps</h3>
              <span>Natural ingredients, made by hand</span>
              <strong>Shop soaps →</strong>
            </a>
            <a className="category-card" href="#/candles">
              <Flame size={28} />
              <h3>Flower Candles</h3>
              <span>Rose and lotus candles, singles and combos</span>
              <strong>Shop candles →</strong>
            </a>
          </div>
        </section>
        <section className="section" id="candles" hidden={page !== "candles"}>
          <div className="section-heading">
            <span className="eyebrow">FLOWER CANDLES</span>
            <h2>Light up your home</h2>
            <p>Handmade rose and lotus candles, singles and gift combos.</p>
          </div>
          <ul className="card-grid">
            {CANDLES.map((c) => (
              <li className="card" key={c.id}>
                {c.images?.length ? (
                  <Gallery
                    photos={c.images.map((f) => `${base}${f}`)}
                    name={c.name}
                  />
                ) : (
                  <div className="card-tile" style={{ background: c.tone }}>
                    <Flame size={40} />
                  </div>
                )}
                <h3>{c.name}</h3>
                <div className="card-foot">
                  <strong>{inr(c.price)}</strong>
                  <button className="primary small" onClick={() => add(c.id)}>
                    <Plus size={16} /> Add
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="hamper-section"
          id="hamper"
          hidden={page !== "home"}
        >
          <div className="hamper-card">
            {HAMPER.images?.length > 0 && (
              <div className="hamper-photo">
                <Gallery
                  photos={HAMPER.images.map((f) => `${base}${f}`)}
                  name={HAMPER.title}
                />
              </div>
            )}
            <span className="eyebrow">
              <Gift size={15} /> DIWALI SPECIAL
            </span>
            <h2>{HAMPER.title}</h2>
            <p>{HAMPER.tagline}</p>
            <ul className="hamper-list">
              {HAMPER.items.map((it) => (
                <li key={it}>
                  <span className="dot" aria-hidden="true" />
                  {it}
                </li>
              ))}
            </ul>
            <div className="hamper-foot">
              <strong className="price">{inr(HAMPER.price)}</strong>
              <button className="gold" onClick={() => add(HAMPER.id)}>
                <Gift size={19} /> Add Hamper to Cart
              </button>
            </div>
            <small>{HAMPER.note}</small>
          </div>
        </section>

        <section className="section" id="wholesale" hidden={page !== "home"}>
          <div className="wholesale-card">
            <Store size={34} />
            <div>
              <h2>{WHOLESALE.title}</h2>
              <p>{WHOLESALE.text}</p>
              <ul>
                {WHOLESALE.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <a className="gold" href="#/contact">
              Enquire for wholesale
            </a>
          </div>
        </section>

        <section className="section alt" id="soap" hidden={page !== "soaps"}>
          <div className="section-heading">
            <span className="eyebrow">HANDMADE SOAP · {PRODUCT.weight}</span>
            <h2>What's inside our soap</h2>
            <p>
              {inr(PRODUCT.price)} each, made with traditional ingredients and
              natural fragrance.
            </p>
          </div>
          {photos.length > 0 && (
            <div className="soap-photo">
              <Gallery photos={photos} name={PRODUCT.name} />
            </div>
          )}
          <ul className="ingredient-grid">
            {PRODUCT.ingredients.map((item) => (
              <li className="ingredient" key={item}>
                <span className="dot" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <div className="center">
            <button className="primary" onClick={() => add(PRODUCT.id)}>
              <ShoppingBag size={19} /> Add Soap · {inr(PRODUCT.price)}
            </button>
          </div>
        </section>

        <section className="section" id="reviews" hidden={page !== "home"}>
          <div className="section-heading">
            <span className="eyebrow">CUSTOMER LOVE</span>
            <h2>What customers say</h2>
          </div>

          {allReviews.length > 0 ? (
            <>
              <ul className="card-grid reviews">
                {allReviews.slice(0, shown).map((r, i) => (
                  <li className="card review" key={i}>
                    <div
                      className="stars"
                      role="img"
                      aria-label={`${r.rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={17}
                          className={n <= r.rating ? "on" : ""}
                        />
                      ))}
                    </div>
                    <p>“{r.text}”</p>
                    {r.photos?.length > 0 && (
                      <div className="review-photos">
                        {r.photos.map((f) => (
                          <img
                            key={f}
                            src={`${base}${f}`}
                            alt={`Photo from ${r.name}`}
                            loading="lazy"
                          />
                        ))}
                      </div>
                    )}
                    <div className="reviewer">
                      <strong>{r.name}</strong>
                      {r.place && <span className="muted">{r.place}</span>}
                    </div>
                  </li>
                ))}
              </ul>
              {shown < allReviews.length && (
                <div className="center">
                  <button
                    className="secondary"
                    onClick={() => setShown((n) => n + REVIEWS_PAGE_SIZE)}
                  >
                    Show more reviews ({allReviews.length - shown} more)
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="no-reviews">
              No reviews yet. Be the first to share your experience!
            </p>
          )}

          <div className="center">
            <a className="primary" href="#/review">
              <Star size={18} /> Write a review
            </a>
          </div>
        </section>

        <section className="section" id="contact" hidden={page !== "contact"}>
          <div className="section-heading">
            <span className="eyebrow">CONTACT US</span>
            <h2>We'd love to hear from you</h2>
            <p>
              Questions, custom orders or wholesale enquiries: message us
              anytime.
            </p>
          </div>
          <div className="contact-grid">
            <ul className="contact-list">
              <li>
                <MessageCircle size={20} />
                <div>
                  <strong>WhatsApp</strong>
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    +{WHATSAPP_NUMBER}
                  </a>
                </div>
              </li>
              {CONTACT.email && (
                <li>
                  <Mail size={20} />
                  <div>
                    <strong>Email</strong>
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </div>
                </li>
              )}
              {CONTACT.instagram && (
                <li>
                  <Sparkles size={20} />
                  <div>
                    <strong>Instagram</strong>
                    <a
                      href={CONTACT.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {CONTACT.instagram.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </li>
              )}
              {CONTACT.address && (
                <li>
                  <MapPin size={20} />
                  <div>
                    <strong>Location</strong>
                    <span>{CONTACT.address}</span>
                  </div>
                </li>
              )}
              {CONTACT.hours && (
                <li>
                  <Phone size={20} />
                  <div>
                    <strong>Hours</strong>
                    <span>{CONTACT.hours}</span>
                  </div>
                </li>
              )}
              <li>
                <Store size={20} />
                <div>
                  <strong>Wholesale</strong>
                  <span>Buying in bulk? Mention it in your message.</span>
                </div>
              </li>
            </ul>
            <form className="contact-form" onSubmit={sendContact}>
              <h3>Send us a message</h3>
              <Field label="Your name">
                <input
                  required
                  value={msg.name}
                  onChange={(e) => setMsg({ ...msg, name: e.target.value })}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </Field>
              <Field label="Message">
                <textarea
                  required
                  value={msg.text}
                  onChange={(e) => setMsg({ ...msg, text: e.target.value })}
                  placeholder="How can we help?"
                />
              </Field>
              <button className="primary full" type="submit">
                <MessageCircle size={19} /> Send on WhatsApp
              </button>
            </form>
          </div>
        </section>

        <section
          className="section"
          id="write-review"
          hidden={page !== "review"}
        >
          <div className="section-heading">
            <span className="eyebrow">YOUR REVIEW</span>
            <h2>Share your experience</h2>
            <p>
              Loved our soap or candles? Tell us what you think. A photo is
              welcome too.
            </p>
          </div>
          <div className="review-cta">
            <ol>
              <li>Tap the button below.</li>
              <li>Enter your name, star rating, comment and photo.</li>
              <li>Press Submit. Thank you!</li>
            </ol>
            {REVIEW_FORM_URL ? (
              <a
                className="primary"
                href={REVIEW_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Star size={18} /> Write a review
              </a>
            ) : (
              <div className="payment-note">
                Review form link is not set yet.
              </div>
            )}
          </div>
        </section>

        <section
          className="order-strip"
          hidden={page === "contact" || page === "review"}
        >
          <div>
            <span className="eyebrow">READY TO ORDER?</span>
            <h2>Bring Madhuri Naturals home.</h2>
          </div>
          <button
            className="gold"
            onClick={() => setPanel(count ? "checkout" : "cart")}
          >
            Checkout →
          </button>
        </section>
      </main>

      <footer>
  <strong>MADHURI NATURALS</strong>
  <span>Handmade soaps &amp; candles • Order on WhatsApp</span>
  <span className="copyright">© {new Date().getFullYear()} Madhuri Naturals. All rights reserved.</span>
</footer>

      {panel === "cart" && (
        <Modal onClose={close} label="Your cart" className="drawer">
          <div className="drawer-head">
            <h2>Your Cart</h2>
            <button onClick={close} aria-label="Close cart">
              <X />
            </button>
          </div>
          {count === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <button className="secondary" onClick={close}>
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              {lines.map((l) => (
                <div className="cart-item" key={l.id}>
                  <div className="item-info">
                    <strong>{l.name}</strong>
                    <span>
                      {l.sub} • {inr(l.price)} each
                    </span>
                    <div className="item-actions">
                      <QtyControl
                        value={l.qty}
                        onChange={(n) => setQty(l.id, n)}
                      />
                      <button
                        className="icon-text"
                        onClick={() => setQty(l.id, 0)}
                        aria-label={`Remove ${l.name}`}
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  </div>
                  <strong>{inr(l.qty * l.price)}</strong>
                </div>
              ))}
              <div className="total-lines">
                <div>
                  <span>Subtotal</span>
                  <span>{inr(subtotal)}</span>
                </div>
                <div>
                  <span>Shipping</span>
                  <span>{SHIPPING_FEE ? inr(SHIPPING_FEE) : "Free"}</span>
                </div>
                <div className="grand">
                  <span>Total</span>
                  <strong>{inr(total)}</strong>
                </div>
              </div>
              <button
                className="primary full"
                onClick={() => setPanel("checkout")}
              >
                Proceed to Checkout
              </button>
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
            <button onClick={closeCheckout} aria-label="Close checkout">
              <X />
            </button>
          </div>
          {order ? (
            <div className="success">
              <CheckCircle2 size={58} />
              <h2>Order details received!</h2>
              <p className="order-ref">
                Order ref: <strong>{order.id}</strong>
              </p>
              <p>
                Send the order details on WhatsApp so we can confirm payment and
                shipping with you.
              </p>
              <button className="primary full" onClick={sendWhatsApp}>
                <MessageCircle size={19} /> Send Order on WhatsApp
              </button>
              <button className="text-button" onClick={closeCheckout}>
                Close
              </button>
            </div>
          ) : count === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <button className="secondary" onClick={close}>
                Continue shopping
              </button>
            </div>
          ) : (
            <form onSubmit={placeOrder} noValidate>
              <div className="summary">
                <span>
                  {count} item{count === 1 ? "" : "s"} in your order
                </span>
                <strong>{inr(total)}</strong>
              </div>
              <Field label="Name" error={errors.name}>
                <input
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="Your full name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                />
              </Field>
              <Field label="Mobile number" error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={setField("phone", digits(10))}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  aria-invalid={!!errors.phone}
                />
              </Field>
              <Field label="Delivery address" error={errors.address}>
                <textarea
                  value={form.address}
                  onChange={setField("address")}
                  placeholder="House / Flat, Street, Area, City"
                  autoComplete="street-address"
                  aria-invalid={!!errors.address}
                />
              </Field>
              <Field label="Pincode" error={errors.pincode}>
                <input
                  value={form.pincode}
                  onChange={setField("pincode", digits(6))}
                  placeholder="6-digit pincode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  aria-invalid={!!errors.pincode}
                />
              </Field>
              <div className="payment-note">
                Payment is confirmed with you on WhatsApp.
              </div>
              <button className="primary full" type="submit">
                Confirm Order · {inr(total)}
              </button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
