#  KhmerBookstore

A modern, full-featured online bookstore built with **React**, **TypeScript**, and **Tailwind CSS**. Browse thousands of titles across every genre, manage a wishlist and cart, track orders, and more — all from a beautifully designed single-page application.

---

##  Preview

> Home page → Category browsing → Book detail → Cart → Checkout

---

##  Features

###  Shopping
- Browse **50,000+** books across 12 categories
- Search by title, author, genre, or tag
- Filter by category via Navbar or Category grid
- Book detail modal with description, rating, and add-to-cart
- Shopping cart with quantity management
- Wishlist to save books for later
- Full checkout flow

###  Pages
| Section | Pages |
|---|---|
| **Shop** | All Books, New Arrivals, Bestsellers, On Sale, Award Winners, Book Bundles |
| **Genres** | Fiction, Non-Fiction, Self-Help, Biography, Children's, Science Fiction, Technology, Khmer Literature, Novel, Health, Finance, Arts |
| **Help** | FAQ, Shipping Info, Returns, Track Order, Gift Cards, Contact Us |

###  Navigation
- Sticky Navbar with search bar, cart & wishlist counters, user account
- **Home** button always returns to the landing page
- Active pill highlights based on current route
- Mobile-responsive hamburger menu + tablet category strip
- Scroll-to-top on every route change

### Interactive Features
- **Gift Cards** — select amount, buy, and receive a generated gift code
- **Track Order** — enter order number to see a live-style delivery timeline
- **Newsletter** — modal popup with email subscribe & success state
- **Contact Form** — subject selector, message field, success confirmation
- **FAQ** — accordion answers across 4 sections with sticky category tabs

---


---

## Getting Started

### Prerequisites
- Node.js **18+**
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/khmer-bookstore.git
cd khmer-bookstore

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Routes

| Path | Page |
|---|---|
| `/` | Home (Hero + Featured + Categories) |
| `/books` | All Books |
| `/new-arrivals` | New Arrivals |
| `/bestsellers` | Bestsellers |
| `/on-sale` | On Sale |
| `/award-winners` | Award Winners |
| `/book-bundles` | Book Bundles |
| `/genre/:id` | Genre page (fiction, non-fiction, selfHelp…) |
| `/faq` | FAQ |
| `/shipping` | Shipping Information |
| `/returns` | Returns & Refunds |
| `/track-order` | Track Order |
| `/gift-cards` | Gift Cards |
| `/contact` | Contact Us |

---

##  Tech Stack

| Tool | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [React Router v6](https://reactrouter.com) | Client-side routing |

---

##  Design System

| Token | Value |
|---|---|
| **Primary colour** | `amber-900` (#78350f) |
| **Accent colour** | `amber-400` / `amber-500` |
| **Background** | `white` / `amber-50` |
| **Dark surface** | `amber-950` (footer) |
| **Font — headings** | Merriweather (serif) |
| **Font — body** | System sans-serif / Tailwind default |
| **Border radius** | `rounded-xl` / `rounded-2xl` / `rounded-full` |

---

##  Key Components Guide

### `BookListPage`
A reusable page wrapper used by all Shop and Genre pages. Accepts:


##  Roadmap

- [ ] Backend integration (Node.js / Supabase)
- [ ] Real authentication (JWT / OAuth)
- [ ] Payment gateway (Stripe / ABA Pay / KHQR)
- [ ] User order history
- [ ] Book reviews & ratings
- [ ] E-book / digital download support
- [ ] Admin dashboard
- [ ] Khmer language (i18n) support

---


##  Author

**KhmerBookstore Team**
- 📍 Phnom Penh, Cambodia
- 📧 support@khmerbookstore.com

---
