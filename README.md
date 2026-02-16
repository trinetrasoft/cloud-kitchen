# Trinetra - Indian Cloud Kitchen Aggregator Platform

A subscription-based SaaS marketplace aggregating 50+ Indian cloud kitchens in the USA. Customers can browse authentic regional Indian cuisine, order from multiple kitchens in a single cart, and manage meal subscriptions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL 16 (Docker) |
| ORM | Prisma v7 (driver adapter) |
| Auth | Clerk (optional, demo mode available) |
| Payments | Stripe v20 (optional, demo mode available) |
| State | Zustand (persisted cart) |

## Prerequisites

- **Node.js** >= 18
- **Docker Desktop** (for PostgreSQL)
- **npm** (comes with Node.js)

## Getting Started

### 1. Clone and Install

```bash
cd cloud-kitchen-platform
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://trinetra:trinetra123@localhost:5432/trinetra_kitchen"
```

Create a `.env.local` file for optional service keys (demo mode works without real keys):

```env
DATABASE_URL="postgresql://trinetra:trinetra123@localhost:5432/trinetra_kitchen"

# Optional - leave as placeholders for demo mode
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_placeholder"
CLERK_SECRET_KEY="sk_test_placeholder"
STRIPE_SECRET_KEY="sk_test_placeholder"
```

### 3. Start PostgreSQL (Docker)

```bash
docker run -d \
  --name trinetra-postgres \
  -e POSTGRES_USER=trinetra \
  -e POSTGRES_PASSWORD=trinetra123 \
  -e POSTGRES_DB=trinetra_kitchen \
  -p 5432:5432 \
  postgres:16-alpine
```

**Windows PowerShell:**
```powershell
docker run -d --name trinetra-postgres -e POSTGRES_USER=trinetra -e POSTGRES_PASSWORD=trinetra123 -e POSTGRES_DB=trinetra_kitchen -p 5432:5432 postgres:16-alpine
```

### 4. Run Database Migrations

```bash
npx prisma migrate deploy
```

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Seed the Database

Seeds 6 Indian cloud kitchens with 32+ menu items, demo users, and reviews.

```bash
npx tsx prisma/seed.ts
```

### 7. Start the Dev Server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

### Production Build

```bash
npm run build
npm start
```

## Demo Mode

The app runs in **demo mode** when Clerk/Stripe keys contain "placeholder" or aren't configured. In demo mode:

- **Auth** is bypassed - all requests use a demo customer account (`customer@trinetra.com`)
- **Payments** are bypassed - orders are created directly with status CONFIRMED
- **Subscriptions** are created directly without Stripe checkout

No sign-up or payment setup required to explore the full platform.

## Project Structure

```
cloud-kitchen-platform/
├── prisma/
│   ├── schema.prisma          # Database schema (8 models)
│   ├── seed.ts                # Demo data seeder
│   └── migrations/            # SQL migrations
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login & signup pages
│   │   ├── (customer)/        # Customer-facing pages
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── kitchens/           # Kitchen listing & detail
│   │   │   ├── cart/               # Shopping cart
│   │   │   ├── checkout/           # Checkout flow
│   │   │   ├── orders/             # Order history & detail
│   │   │   └── subscription/       # Subscription plans
│   │   ├── (kitchen-owner)/   # Kitchen owner dashboard
│   │   │   └── dashboard/
│   │   │       ├── page.tsx        # Dashboard stats
│   │   │       ├── orders/         # Order management
│   │   │       └── menu/           # Menu CRUD
│   │   └── api/               # API routes (see below)
│   ├── components/
│   │   ├── ui/                # shadcn/ui primitives
│   │   ├── shared/            # Header, Footer, SearchBar
│   │   ├── kitchen/           # KitchenCard, KitchenGrid, MenuItem
│   │   ├── cart/              # CartDrawer, CartItem, CartSummary
│   │   └── order/             # OrderCard
│   ├── lib/                   # prisma, stripe, auth, utils
│   ├── stores/                # Zustand cart store
│   ├── hooks/                 # useCart, useOrders
│   └── types/                 # TypeScript interfaces
└── package.json
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with featured kitchens and search |
| `/kitchens` | Browse all kitchens with cuisine/region filters |
| `/kitchens/[slug]` | Kitchen detail with menu and reviews |
| `/cart` | Shopping cart (multi-kitchen support) |
| `/checkout` | Checkout with delivery details |
| `/orders` | Order history |
| `/orders/[id]` | Order detail with status timeline |
| `/subscription` | Subscription plans (Basic/Family/Party Pro) |
| `/login` | Login page (demo mode card when Clerk not configured) |
| `/signup` | Signup page (demo mode card when Clerk not configured) |
| `/dashboard` | Kitchen owner dashboard with stats |
| `/dashboard/orders` | Accept/reject incoming orders |
| `/dashboard/menu` | Add/edit/delete menu items |

## API Reference

All API routes return JSON. Base URL: `http://localhost:3000`

---

### Kitchens

#### `GET /api/kitchens`

List all active kitchens with ratings.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `cuisine` | string | Filter by cuisine type (e.g., `SOUTH_INDIAN`, `NORTH_INDIAN`) |
| `region` | string | Filter by region tag (e.g., `tamil`, `punjabi`) |
| `q` | string | Search by kitchen name or description |

**Example:**
```bash
# All kitchens
curl http://localhost:3000/api/kitchens

# Filter by cuisine
curl http://localhost:3000/api/kitchens?cuisine=SOUTH_INDIAN

# Search
curl http://localhost:3000/api/kitchens?q=punjab
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Amma's Kitchen",
    "slug": "ammas-kitchen",
    "description": "Authentic South Indian home cooking",
    "cuisineTypes": ["SOUTH_INDIAN"],
    "regionTags": ["tamil", "kerala"],
    "city": "Jersey City",
    "state": "NJ",
    "imageUrl": "https://images.unsplash.com/...",
    "avgRating": 4.7,
    "reviewCount": 3,
    "menuItemCount": 5,
    "avgPrepTimeMinutes": 25,
    "verificationStatus": "CERTIFIED"
  }
]
```

---

#### `GET /api/kitchens/[slug]`

Get kitchen detail with menu items and reviews. Accepts kitchen `id` or `slug`.

**Example:**
```bash
curl http://localhost:3000/api/kitchens/rajasthani-royal-thali
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Rajasthani Royal Thali",
  "slug": "rajasthani-royal-thali",
  "description": "...",
  "cuisineTypes": ["RAJASTHANI"],
  "regionTags": ["rajasthani", "marwari"],
  "avgRating": 4.5,
  "reviewCount": 2,
  "menuItems": [
    {
      "id": "uuid",
      "name": "Dal Baati Churma",
      "category": "main",
      "price": 16.99,
      "dietaryTags": ["veg"],
      "ingredients": ["wheat", "lentils", "ghee"],
      "allergens": ["gluten", "dairy"],
      "spiceLevel": 2,
      "isAvailable": true
    }
  ],
  "reviews": [
    {
      "id": "uuid",
      "overallRating": 5,
      "reviewText": "Amazing food!",
      "createdAt": "2026-02-14T17:01:09.036Z",
      "user": { "firstName": "Priya", "lastName": "Sharma" }
    }
  ]
}
```

---

### Menu Items

#### `GET /api/menu`

List menu items with optional filters.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `kitchenId` | string | Filter by kitchen ID |
| `category` | string | Filter by category (`appetizer`, `main`, `bread`, `rice`, `dessert`, `beverage`, `snack`) |
| `dietary` | string | Filter by dietary tag (`veg`, `vegan`, `gluten-free`, `jain`) |
| `q` | string | Search by item name or description |

**Example:**
```bash
# All menu items for a kitchen
curl "http://localhost:3000/api/menu?kitchenId=<kitchen-uuid>"

# Vegetarian items only
curl http://localhost:3000/api/menu?dietary=veg

# Search
curl "http://localhost:3000/api/menu?q=biryani"
```

---

### Search

#### `GET /api/search`

Search across kitchens and menu items simultaneously.

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query (min 2 characters) |

**Example:**
```bash
curl "http://localhost:3000/api/search?q=biryani"
```

**Response:**
```json
{
  "kitchens": [],
  "menuItems": [
    {
      "id": "uuid",
      "name": "Chicken Biryani",
      "price": 18.99,
      "category": "rice",
      "kitchen": {
        "id": "uuid",
        "name": "Punjab Da Dhaba",
        "slug": "punjab-da-dhaba"
      }
    }
  ]
}
```

---

### Orders

#### `GET /api/orders`

List all orders for the authenticated user (demo user in demo mode).

**Example:**
```bash
curl http://localhost:3000/api/orders
```

**Response:**
```json
[
  {
    "id": "uuid",
    "orderNumber": "ORD-ABC123",
    "status": "CONFIRMED",
    "totalAmount": 37.98,
    "finalAmount": 48.00,
    "paymentStatus": "PAID",
    "createdAt": "2026-02-14T18:00:00.000Z",
    "items": [
      {
        "id": "uuid",
        "quantity": 2,
        "priceAtTime": 18.99,
        "kitchenName": "Punjab Da Dhaba",
        "menuItemName": "Chicken Biryani"
      }
    ]
  }
]
```

---

#### `POST /api/orders`

Create a new order.

**Request Body:**
```json
{
  "items": [
    {
      "kitchenId": "kitchen-uuid",
      "menuItemId": "menu-item-uuid",
      "quantity": 2,
      "price": 18.99,
      "specialInstructions": "Extra spicy"
    }
  ],
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Jersey City",
    "state": "NJ",
    "zip": "07302"
  },
  "specialInstructions": "Ring doorbell"
}
```

**Response:**
```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-ABC123",
    "status": "CONFIRMED",
    "totalAmount": 37.98,
    "platformFee": 1.90,
    "deliveryFee": 4.99,
    "taxAmount": 3.13,
    "finalAmount": 48.00,
    "paymentStatus": "PAID"
  },
  "clientSecret": null
}
```

---

#### `GET /api/orders/[id]`

Get details for a specific order.

```bash
curl http://localhost:3000/api/orders/<order-uuid>
```

---

### Subscription

#### `GET /api/subscription`

Get the active subscription for the current user.

```bash
curl http://localhost:3000/api/subscription
```

**Response:**
```json
{
  "subscription": {
    "id": "uuid",
    "tier": "BASIC",
    "status": "ACTIVE",
    "currentPeriodStart": "2026-02-14T00:00:00.000Z",
    "currentPeriodEnd": "2026-03-16T00:00:00.000Z"
  }
}
```

---

#### `POST /api/subscription`

Create a new subscription.

**Request Body:**
```json
{
  "tier": "BASIC"
}
```

**Tiers:** `BASIC`, `FAMILY`, `PARTY_PRO`

**Response (demo mode):**
```json
{
  "url": "/subscription?success=true"
}
```

---

### Webhooks

#### `POST /api/webhooks/stripe`

Stripe webhook endpoint for processing subscription events. Only active when real Stripe keys are configured.

---

## Database Schema

8 models managed by Prisma:

| Model | Description |
|-------|-------------|
| `User` | Customers and kitchen owners |
| `Kitchen` | Cloud kitchen profiles with cuisine types, region tags, hygiene scores |
| `MenuItem` | Food items with dietary tags, allergens, ingredients, pricing |
| `Order` | Customer orders with multi-kitchen support and status tracking |
| `OrderItem` | Individual items within an order |
| `Subscription` | Meal plan subscriptions (Basic / Family / Party Pro) |
| `Review` | Kitchen ratings and text reviews |
| `UserAddress` | Saved delivery addresses |

### Useful Prisma Commands

```bash
# Open Prisma Studio (visual database browser at http://localhost:5555)
npx prisma studio

# Reset database and re-seed
npx prisma migrate reset

# Create a new migration after schema changes
npx prisma migrate dev --name <migration-name>
```

## Seeded Demo Data

The seed script creates:

| Kitchen | Cuisine | Items |
|---------|---------|-------|
| Amma's Kitchen | South Indian | 5 (dosa, idli, sambar, etc.) |
| Punjab Da Dhaba | North Indian | 7 (butter chicken, biryani, naan, etc.) |
| Andhra Spice Box | Andhra/Telangana | 5 (dum biryani, gongura, etc.) |
| Rajasthani Royal Thali | Rajasthani | 5 (dal baati, laal maas, etc.) |
| Kerala Kairali | Kerala | 5 (appam, fish curry, puttu, etc.) |
| Gujarati Ghar | Gujarati | 5 (dhokla, thepla, undhiyu, etc.) |

Plus 2 demo users and reviews for each kitchen.

## Common Commands

```bash
# Start development server
npm run dev

# Production build and start
npm run build
npm start

# Seed database
npx tsx prisma/seed.ts

# Open database GUI
npx prisma studio

# Start PostgreSQL (if stopped)
docker start trinetra-postgres

# Stop PostgreSQL
docker stop trinetra-postgres

# Check PostgreSQL status
docker ps --filter name=trinetra-postgres

# Lint
npm run lint
```

## Troubleshooting

### Port 5432 already in use
Stop any existing PostgreSQL service or change the Docker port mapping:
```bash
docker run -d --name trinetra-postgres -p 5433:5432 ...
```
Then update `DATABASE_URL` to use port `5433`.

### Docker container not starting
```bash
# Check if container exists but is stopped
docker ps -a --filter name=trinetra-postgres

# Start existing container
docker start trinetra-postgres

# Or remove and recreate
docker rm trinetra-postgres
# Then run the docker run command again
```

### Prisma generate errors
```bash
# Regenerate Prisma client
npx prisma generate

# If schema changed, create migration
npx prisma migrate dev --name <description>
```

### Blank page or hydration errors
Clear the `.next` cache and restart:
```bash
rm -rf .next
npm run dev
```

### Windows: rm not found
Use PowerShell equivalents:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```
