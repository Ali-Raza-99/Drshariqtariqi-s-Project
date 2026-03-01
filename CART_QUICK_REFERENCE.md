# Quick Reference Guide - Dynamic Cart System

## File Structure

```
src/
├── context/
│   ├── CartContext.jsx          ✅ Cart state management
│   └── AuthContext.jsx          (existing)
├── components/
│   ├── Products.jsx             ✅ Updated with Cart Context
│   ├── ProductCard.jsx          ✅ Updated for cart integration
│   ├── Orders.jsx               ✅ NEW - View order history
│   └── cart/
│       ├── CartDialog.jsx       ✅ Updated with dynamic data
│       ├── AddToCartButton.jsx  (existing)
│       └── CartQuantityControl.jsx (existing)
└── firebase/
    └── firestore.js             ✅ Updated with cart/order functions
```

## Key Files Changed

### 1. `src/firebase/firestore.js`
**Added Functions:**
- `addOrderToCart()` - Add item to cart
- `getUserCart()` - Fetch user's cart
- `updateCartItemQuantity()` - Update quantity
- `removeFromCart()` - Remove item
- `clearUserCart()` - Clear entire cart
- `placeOrder()` - Create new order
- `getUserOrders()` - Fetch user's orders
- `updateOrder()` - Update order status
- `deleteOrder()` - Delete order

### 2. `src/context/CartContext.jsx` (NEW)
**Features:**
- Global cart state management
- Auto-sync with Firestore
- Add/remove/update operations
- Checkout functionality
- Order management
- Loading & error handling

### 3. `src/components/cart/CartDialog.jsx`
**Changes:**
- Removed hardcoded data
- Uses Cart Context for dynamic data
- Real-time quantity updates
- Delete item functionality
- Checkout with loading state
- Error handling

### 4. `src/components/Products.jsx`
**Changes:**
- Imports CartProvider
- Uses Cart Context (useCart hook)
- Simplified cart handling
- Removed duplicate cart dialog
- Uses new CartDialog component

### 5. `src/components/ProductCard.jsx`
**Changes:**
- Updated props structure
- Simplified for context-based approach
- Removed cart quantity display
- Renamed "Buy Now" to "Add to Cart"

### 6. `src/components/Orders.jsx` (NEW)
**Features:**
- View all user orders
- Expandable order details
- Order status with colored chips
- Full order details modal
- Date formatting
- Item breakdown

### 7. `src/main.jsx`
**Changes:**
- Added CartProvider wrapper
- Wraps app with cart context

## API Endpoints (Firestore)

### User Cart
```
users/{uid}/cart/{cartItemId}
```

### User Orders
```
users/{uid}/orders/{orderId}
```

## Component Props

### CartDialog
```javascript
<CartDialog
  open={boolean}
  onClose={function}
/>
```

### Orders Component
```javascript
<Route path="/orders" element={<Orders />} />
```

### ProductCard
```javascript
<ProductCard
  image={string}
  name={string}
  price={number}
  id={string}
  onIncreaseQty={function}
  onDecreaseQty={function}
  onViewDetails={function}
/>
```

## Context Hooks

### useCart()
```javascript
const {
  // State
  cartItems,
  totalItems,
  totalAmount,
  cartLoading,
  cartError,
  orders,
  ordersLoading,
  
  // Functions
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  checkout,
  loadOrders,
} = useCart();
```

## Database Schema

### Cart Item
```javascript
{
  productId: string,
  name: string,
  price: number,
  image: string,
  quantity: number,
  addedAt: timestamp,
  updatedAt: timestamp
}
```

### Order
```javascript
{
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
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled",
  deliveryAddress: string,
  notes: string,
  placedAt: timestamp,
  updatedAt: timestamp
}
```

## Common Tasks

### 1. Display Cart Count
```javascript
import { useCart } from "../context/CartContext";

function Header() {
  const { totalItems } = useCart();
  return <Badge badgeContent={totalItems} />;
}
```

### 2. Add Product to Cart
```javascript
const { addToCart } = useCart();

await addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.imageUrl
});
```

### 3. Open Cart Dialog
```javascript
const [cartOpen, setCartOpen] = useState(false);

return (
  <>
    <IconButton onClick={() => setCartOpen(true)}>
      <ShoppingCartIcon />
    </IconButton>
    <CartDialog open={cartOpen} onClose={() => setCartOpen(false)} />
  </>
);
```

### 4. Checkout
```javascript
const { checkout } = useCart();

await checkout({
  deliveryAddress: userAddress,
  notes: orderNotes
});
```

### 5. View Orders
```javascript
// Add route in App.jsx
<Route path="/orders" element={<Orders />} />

// Or display Orders component directly
<Orders />
```

## Environment Setup

1. ✅ Firestore initialized in `firebase.js`
2. ✅ AuthContext provides authentication
3. ✅ CartContext provides cart management
4. ✅ All components properly wrapped

## Testing Checklist

- [ ] User can add product to cart
- [ ] Cart badge shows correct count
- [ ] Can increase/decrease quantity
- [ ] Can remove item from cart
- [ ] Can checkout and create order
- [ ] Order appears in Orders page
- [ ] Cart clears after checkout
- [ ] Order status displays correctly
- [ ] Firestore data persists correctly

## Deployment Notes

1. Set up Firestore security rules
2. Enable authentication methods
3. Deploy Firestore indexes if needed
4. Test in production environment

## Support

For issues:
1. Check console for error messages
2. Verify Firestore security rules
3. Ensure user is authenticated
4. Check network tab for API calls
5. Review Firestore data structure
