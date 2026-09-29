# Kids Phonics Academy

Production-ready full-stack app for selling phonics PDF workbooks.

PDFs and thumbnails live in **Cloudinary**. MongoDB stores product metadata, orders, analytics and contact messages. The React storefront never hardcodes the catalogue.

## Stack

- Frontend: React, Vite, Tailwind CSS, React Router (Vercel or Netlify)
- Backend: Node.js, Express (Render)
- Database: MongoDB Atlas
- Files: Cloudinary
- Payments: Stripe (EUR) and Razorpay (INR)
- Email: Nodemailer

## Project layout

```
client/   Vite React storefront
server/   Express API
```

## Local setup

### 1. Backend

```bash
cd server
copy .env.example .env
npm install
```

Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_API_KEY`, Cloudinary, Stripe, Razorpay and SMTP values in `server/.env`.

```bash
npm run seed
npm run dev
```

Seed inserts 12 sample products (empty `pdfUrl`). Upload each PDF and thumbnail to Cloudinary, then:

```http
PUT /api/products/:id
x-admin-key: your-admin-key

{
  "thumbnailUrl": "https://res.cloudinary.com/…/thumb.jpg",
  "pdfUrl": "https://res.cloudinary.com/…/file.pdf"
}
```

POST / PUT / DELETE product routes are ready for Phase 2 Admin Dashboard and are protected by `x-admin-key`.

### 2. Frontend

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

## Public product API

`GET /api/products?page=1&limit=12&search=blend&category=Alphabet`

- Returns only **active** products
- Pagination, category filter and search are built in
- **Does not** expose `pdfUrl` (files unlock after verified payment)

Also:

- `GET /api/products/:id` (increments views)
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

## Payments

No login. Flow: Resources → Buy Now → Stripe or Razorpay → server verifies payment → Order saved → secure download token.

- Stripe Checkout (EUR)
- Razorpay Checkout (INR)
- Stripe webhook: `POST /api/payments/stripe/webhook`
- Downloads increment `Order.downloadCount` and `ProductAnalytics.downloads`

## Contact

`POST /api/contact` saves a `ContactMessages` document and emails `ADMIN_EMAIL` via Nodemailer with subject **New Contact Form Submission**.

## Deploy

**Frontend (Vercel):** root `client`, build `npm run build`, output `dist`, env `VITE_API_URL` = your Render API `/api`.

**Frontend (Netlify):** same build, `_redirects` included for SPA routing.

**Backend (Render):** root `server`, start `npm start`, env vars from `server/.env.example`.

**Database:** MongoDB Atlas, allow Render IP / `0.0.0.0/0` for testing.

Set Stripe webhook URL to `https://YOUR-API.onrender.com/api/payments/stripe/webhook`.
