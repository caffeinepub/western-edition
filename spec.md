# Western Edition

## Current State

The app is a luxury furniture e-commerce site with:
- **Backend**: Motoko with Product catalog (10 hardcoded products), ShowroomLead submission, product view tracking (getMostLoved), and basic query/filter functions.
- **Frontend**: 4 pages — HomePage, ShopPage, ProductDetailPage, AboutPage. Navigation, horizontal scroll sections (Shop by Room, New Arrivals, Most Loved), before/after slider, WhatsApp floating button.
- **No**: user accounts, authentication, cart, checkout, payments, orders, wishlist, or admin panel.

## Requested Changes (Diff)

### Add

**Customer Authentication**
- Email + password registration and login for customers
- Auth state persisted across sessions

**Customer Account Page (`/account`)**
- Profile info (name, email, phone)
- Recent searches (last 10 product searches)
- Wishlist (saved products)
- Order history with status tracking (Confirmed, Shipped, Delivered, Cancelled)
- Past orders view

**Wishlist**
- Add/remove products to wishlist from ShopPage and ProductDetailPage
- Wishlist stored per user account

**Cart**
- Persistent cart saved to user account
- Add to cart from ProductDetailPage (with selected material/upholstery)
- Cart icon in navbar (left of menu/hamburger button)
- Cart page (`/cart`) with line items, quantities, remove, subtotal

**Checkout Page (`/checkout`)**
- Order summary
- Delivery address form (name, address, city, state, pincode, phone)
- Payment method selection:
  - COD — token amount ₹500–₹2,000 based on order value (auto-calculated)
  - Prepaid — Razorpay (placeholder UI, keys configurable from admin)
  - Partial Payment — slider from 10% to 100% of order value

**Order Management (Backend)**
- Orders stored per user with items, address, payment method, status
- Order ID generation
- Status: Confirmed, Shipped, Delivered, Cancelled

**Admin Panel (`/admin`)**
- Separate admin login (email + password, single admin account)
- Dashboard overview (product count, order count, lead count)
- Product management: add, edit, delete products (all fields including materials, upholstery, room, category, price, isNewArrival)
- Order management: view all orders, update status
- Showroom leads: view all submitted leads
- Settings: configure Razorpay key (stored in backend)
- Admin-only route guard

### Modify

- **Product type**: Add `imageUrl` field (optional, for future image uploads)
- **Backend**: Products moved from hardcoded array to mutable Map so admin can add/edit/delete
- **Navbar**: Add cart icon (with item count badge) to the left of the menu/hamburger button
- **ProductDetailPage**: Add "Add to Cart" and "Add to Wishlist" buttons
- **ShopPage**: Add wishlist heart icon on product cards

### Remove

- Nothing removed

## Implementation Plan

1. **Backend (Motoko)**
   - Add Customer type: `{ id, email, passwordHash, name, phone, createdAt }`
   - Add CartItem type: `{ productId, material, upholstery, quantity }`
   - Add Cart per user: `Map<userId, [CartItem]>`
   - Add Order type: `{ id, userId, items, address, paymentMethod, tokenAmount, partialPercent, total, status, createdAt }`
   - Add Wishlist per user: `Map<userId, [productId]>`
   - Add RecentSearches per user: `Map<userId, [Text]>`
   - Add Admin type with single admin credential storage
   - Move products from `let` to `var` Map for mutability
   - Add Razorpay key setting in backend
   - Expose all CRUD APIs: customer auth, cart ops, order ops, wishlist ops, admin product CRUD, admin order status update, admin login, settings

2. **Frontend — Auth & Account**
   - Login/Register modal or page
   - Account page with tabs: Profile, Orders, Wishlist, Recent Searches

3. **Frontend — Cart**
   - Cart context/store (synced with backend)
   - Cart icon with badge in navbar
   - Cart page with line items

4. **Frontend — Checkout & Payment**
   - Checkout page with address form
   - Payment method selector (COD / Prepaid / Partial)
   - Partial payment slider
   - Order confirmation page/state

5. **Frontend — Admin Panel**
   - Admin login page
   - Dashboard
   - Products CRUD table
   - Orders table with status dropdowns
   - Leads table
   - Settings (Razorpay key)

6. **Frontend — Wishlist**
   - Heart toggle on product cards and detail page
   - Wishlist tab in account page
