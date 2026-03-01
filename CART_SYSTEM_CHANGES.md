# Cart System Architecture Changes

## Overview
The cart system has been restructured to use a new collection hierarchy with proper separation between active cart items and completed orders (checkouts).

## Database Structure

### 1. Active Cart Items (Orders Collection)
**Path:** `users/{uid}/orders`

Stores all active cart items for each user. This is where products are added to cart and quantity is managed.

```
users/{uid}/orders/{cartItemId}
{
  productId: string,
  name: string,
  price: number,
  image: string,
  quantity: number,
  isCheckout: boolean (false for active items),
  addedAt: timestamp,
  updatedAt: timestamp
}
```

**Key Features:**
- Items with quantity 0 are kept in the collection and displayed in the cart UI
- Used for "Add to Cart" functionality
- Automatically increments quantity if product already exists
- Supports quantity values including 0 (out of stock indicator)

### 2. Completed Checkouts (Checkout Collection)
**Path:** `checkout/{checkoutId}`

Global checkout collection storing all completed orders across all users, indexed by user ID for filtering.

```
checkout/{checkoutId}
{
  uid: string (user ID for filtering),
  items: [
    {
      productId: string,
      name: string,
      price: number,
      quantity: number,
      subtotal: number
    }
  ],
  totalItems: number,
  totalAmount: number,
  status: "completed",
  checkoutDate: timestamp,
  updatedAt: timestamp,
  deliveryAddress: string (optional),
  notes: string (optional),
  ...additionalData
}
```

**Key Features:**
- Global collection enables admin dashboard to view all orders
- Indexed by `uid` for user-specific filtering
- Immutable record of completed transactions
- Timestamp ordered (most recent first)

---

## Firestore Functions Updated

### Cart Operations

#### `addOrderToCart({ uid, productId, productData, quantity = 1 })`
- Adds product to `users/{uid}/orders` collection
- If product already exists, increments quantity
- Returns the document reference
- Sets `isCheckout: false` for active items

#### `getUserCart(uid)`
- Fetches all items from `users/{uid}/orders` where `isCheckout: false`
- Returns array of active cart items only
- Filters out completed items

#### `updateCartItemQuantity({ uid, cartItemId, quantity })`
- Updates quantity in `users/{uid}/orders/{cartItemId}`
- **NOW:** Allows quantity 0 (doesn't auto-delete anymore)
- Used by decrease button to show "out of stock"

#### `removeFromCart({ uid, cartItemId })`
- Permanently deletes item from `users/{uid}/orders/{cartItemId}`
- Used when user clicks delete button

#### `clearUserCart(uid)`
- Deletes all items from `users/{uid}/orders` collection
- Called after successful checkout

### Checkout Operations

#### `createCheckout({ uid, orderData })`
- Creates new document in `checkout` collection
- Stores uid for filtering
- Sets status to "completed"
- Sets checkoutDate timestamp
- Returns the checkout document reference

#### `getUserCheckouts(uid)`
- Queries `checkout` collection by `uid`
- Ordered by `checkoutDate` descending (newest first)
- Returns all checkouts for a specific user
- Uses Firestore `where` clause for efficient filtering

#### `updateCheckout({ checkoutId, data })`
- Updates document in `checkout` collection
- Used for order status changes
- Updates `updatedAt` timestamp

#### `deleteCheckout(checkoutId)`
- Removes checkout from `checkout` collection
- Admin only operation

---

## CartContext Changes

### State Management

```javascript
const [cartItems, setCartItems] = useState([]);      // Active cart items
const [orders, setOrders] = useState([]);            // Completed checkouts
const [cartLoading, setCartLoading] = useState(false);
const [ordersLoading, setOrdersLoading] = useState(false);
```

### Functions

#### `addToCart(productData)`
- Adds to `users/{uid}/orders` collection
- Auto-increments if exists
- Reloads cart to show updated state

#### `updateQuantity(cartItemId, quantity)`
- Can set quantity to 0 (displays as "out of stock")
- Supports any positive number or 0
- Updates without deletion

#### `removeItem(cartItemId)`
- Permanently removes item from cart
- Different from setting quantity to 0

#### `checkout(additionalOrderData)`
- Filters cart for items with quantity > 0
- Creates checkout record in global `checkout` collection
- Clears active cart after successful checkout
- Returns checkout reference

#### `loadOrders()`
- Loads completed checkouts from `checkout` collection
- Uses `getUserCheckouts(uid)` internally
- Ordered by most recent first

---

## UI Changes

### CartDialog Component

#### Items Display
- **All items** shown including those with quantity 0
- Items with quantity 0:
  - Have red/error background color
  - Show "Out of stock" label
  - Image opacity reduced to 0.5
  - Still fully functional for quantity control

#### Order Summary
- Shows only items with quantity > 0 in the total
- Displays count of items with quantity 0
- Total calculation excludes zero-quantity items

#### Checkout Button
- Disabled only if ALL items have quantity 0
- Still active if mix of 0 and positive quantities
- Checkout creates order with only positive quantity items

#### Quantity Controls
- Decrease button can set quantity to 0
- User can increase from 0 back to positive
- Delete button always removes item permanently

---

## Data Flow

### Adding to Cart
```
Product Card → addToCart() 
  → addOrderToCart() 
  → users/{uid}/orders
  → Auto-increment if exists
  → Reload and display
```

### Increasing/Decreasing Quantity
```
Quantity Control → updateQuantity()
  → updateCartItemQuantity()
  → users/{uid}/orders/{cartItemId}
  → Update quantity (can be 0)
  → Reload and display
```

### Removing Item
```
Delete Button → removeItem()
  → removeFromCart()
  → Delete from users/{uid}/orders/{cartItemId}
  → Reload and display
```

### Checkout
```
Checkout Button → checkout()
  → Filter items (qty > 0)
  → createCheckout() 
  → Create in checkout/{checkoutId}
  → clearUserCart()
  → Delete all from users/{uid}/orders
  → Success notification
```

### Viewing Orders
```
Orders Component → loadOrders()
  → getUserCheckouts(uid)
  → Query checkout WHERE uid == currentUser.uid
  → Display in order history
```

---

## Firestore Security Rules

### Cart Items (users/{uid}/orders)
```javascript
match /users/{uid}/orders/{document=**} {
  allow read, write: if request.auth.uid == uid;
}
```

### Checkout Collection
```javascript
match /checkout/{document=**} {
  allow create: if request.auth != null;
  allow read: if resource.data.uid == request.auth.uid;
  allow update, delete: if request.auth.uid in get(/databases/$(database)/documents/users/$(resource.data.uid)).data.role == "admin";
}
```

---

## Benefits of New Architecture

1. **Quantity 0 Support**: Items can show as "out of stock" without deletion
2. **Global Checkout History**: Admin can view all orders in one collection
3. **UID Indexing**: Efficient filtering of checkouts by user
4. **Clear Separation**: Active items vs. completed orders
5. **Scalability**: Independent collection growth
6. **Audit Trail**: Complete checkout history with timestamps
7. **Real-time Updates**: Firebase listeners can track orders

---

## Migration Notes

- Existing cart items in `users/{uid}/cart` should be migrated to `users/{uid}/orders`
- Existing orders in `users/{uid}/orders` with `isCheckout: true` should be moved to `checkout` collection
- Add `uid` field to moved checkout items
- Update `placedAt` → `checkoutDate` for consistency

---

## Testing Checklist

- [ ] Add product to cart
- [ ] Increase quantity
- [ ] Decrease quantity to 0 (shows "out of stock")
- [ ] Increase quantity back from 0
- [ ] Delete item from cart
- [ ] Checkout with mix of 0 and positive quantities
- [ ] Verify checkout creates record in `checkout` collection
- [ ] Verify cart cleared after checkout
- [ ] Load order history (shows only checkouts)
- [ ] Verify quantities 0 don't appear in completed orders

