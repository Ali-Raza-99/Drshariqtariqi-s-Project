# Dynamic Cart System Documentation

## Overview
This is a complete dynamic shopping cart system with Firebase Firestore integration for real-time data persistence. Users can add products to cart, manage quantities, and place orders.

## Architecture

### 1. **Firebase Firestore Structure**

#### User Cart Collection (`users/{uid}/cart`)
Each user has a sub-collection storing their current cart items:
```
users/
  {uid}/
    cart/
      {cartItemId}/
        - productId: string (product ID)
        - name: string (product name)
        - price: number (product price)
        - image: string (product image URL)
        - quantity: number (item quantity)
        - addedAt: timestamp (when added)
        - updatedAt: timestamp (last update)
```

#### User Orders Collection (`users/{uid}/orders`)
Each user has a sub-collection storing their order history:
```
users/
  {uid}/
    orders/
      {orderId}/
        - items: array (order items)
        - totalItems: number (total quantity)
        - totalAmount: number (total price)
        - status: string (pending/confirmed/shipped/delivered/cancelled)
        - deliveryAddress: string
        - notes: string
        - placedAt: timestamp (order placement time)
        - updatedAt: timestamp (last update)
```

## Components

### 1. **CartContext** (`src/context/CartContext.jsx`)
Global state management for cart operations using React Context API.

**Features:**
- Add/remove items from cart
- Update item quantities
- Calculate totals (items count & amount)
- Place orders (checkout)
- Load/manage user orders
- Auto-sync with Firestore

**Hooks:**
```javascript
const {
  cartItems,              // Current cart items array
  totalItems,             // Total quantity of items
  totalAmount,            // Total price
  cartLoading,            // Loading state
  cartError,              // Error messages
  addToCart,              // Add product to cart
  updateQuantity,         // Update item quantity
  removeItem,             // Remove item from cart
  clearCart,              // Clear all items
  checkout,               // Place order
  orders,                 // User's orders
  ordersLoading,          // Orders loading state
  loadOrders,             // Load user orders
} = useCart();
```

### 2. **CartDialog** (`src/components/cart/CartDialog.jsx`)
Modal component displaying shopping cart with dynamic item management.

**Features:**
- Display all cart items
- Update quantities (+/-)
- Remove individual items
- Show real-time totals
- Checkout button
- Loading & error states

### 3. **Orders Component** (`src/components/Orders.jsx`)
Dedicated page for viewing user order history and details.

**Features:**
- List all user orders
- Expandable order summaries
- Detailed order view dialog
- Order status tracking
- Date formatting
- Item breakdown

### 4. **ProductCard** (`src/components/ProductCard.jsx`)
Simplified card component for displaying products.

**Features:**
- Product image, name, price
- Add to cart button (with login check)
- View product details
- Star ratings

### 5. **Products** (`src/components/Products.jsx`)
Main products page with carousel and cart integration.

**Features:**
- Products carousel with navigation
- Product filtering
- Cart icon with badge (showing item count)
- Responsive design
- Integration with cart system

## Firestore Functions (`src/firebase/firestore.js`)

### Cart Operations
```javascript
// Add item to cart (auto-increments if exists)
addOrderToCart({ uid, productId, productData, quantity = 1 })

// Get all cart items for user
getUserCart(uid)

// Update item quantity (or delete if 0)
updateCartItemQuantity({ uid, cartItemId, quantity })

// Remove single item from cart
removeFromCart({ uid, cartItemId })

// Clear entire cart
clearUserCart(uid)
```

### Order Operations
```javascript
// Place new order (saves order data & clears cart)
placeOrder({ uid, orderData })

// Get all user orders
getUserOrders(uid)

// Update order status
updateOrder({ uid, orderId, data })

// Delete order
deleteOrder({ uid, orderId })
```

## Data Flow

### Adding Item to Cart
1. User clicks "Add to Cart" on ProductCard
2. `handleAddToCart()` in Products.jsx calls `addToCart()`
3. CartContext adds item to Firestore `users/{uid}/cart`
4. If product exists, quantity is incremented
5. CartDialog auto-updates to show new item
6. Badge on cart icon updates with new count

### Updating Quantity
1. User clicks +/- in CartDialog
2. `updateQuantity()` is called with cartItemId and new quantity
3. Firestore updates the item quantity
4. If quantity is 0, item is deleted
5. CartDialog re-renders with updated data

### Placing Order
1. User clicks "Checkout" button
2. `checkout()` is called from CartContext
3. Creates order document in `users/{uid}/orders`
4. Clears cart by deleting all items from `users/{uid}/cart`
5. Dialog closes and success message appears
6. Order can be viewed in Orders page

## Setup Instructions

### 1. Wrap App with CartProvider
In `main.jsx`:
```javascript
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

### 2. Import and Use Cart Components
```javascript
import CartDialog from "./components/cart/CartDialog";
import Orders from "./components/Orders";
import { useCart } from "./context/CartContext";

// In your component:
const { addToCart, totalItems } = useCart();
```

### 3. Add Orders Route (in App.jsx)
```javascript
import Orders from "./components/Orders";

// Add route:
<Route path="/orders" element={<Orders />} />
```

## Usage Examples

### Example 1: Display Cart Count in Navbar
```javascript
import { useCart } from "../context/CartContext";

function Navbar() {
  const { totalItems } = useCart();
  
  return (
    <Badge badgeContent={totalItems} color="error">
      <ShoppingCartIcon />
    </Badge>
  );
}
```

### Example 2: Add Product to Cart
```javascript
const { addToCart } = useCart();

const handleAddClick = async () => {
  try {
    await addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
    });
  } catch (err) {
    console.error("Failed to add:", err);
  }
};
```

### Example 3: Checkout
```javascript
const { checkout, clearCart } = useCart();

const handleCheckout = async () => {
  try {
    await checkout({
      deliveryAddress: userAddress,
      notes: orderNotes,
    });
    alert("Order placed successfully!");
  } catch (err) {
    console.error("Checkout failed:", err);
  }
};
```

## Error Handling

The system includes comprehensive error handling:

1. **Login Required**: User must be logged in to add items
2. **Network Errors**: Handled via try-catch in all async operations
3. **Validation**: Product data validation before adding to cart
4. **Quantity Limits**: Max 99 items per product, min 0 (auto-delete)

## Security Considerations

1. **Firestore Rules**: Set up rules to allow users to only access their own cart/orders
2. **User UID**: Always use authenticated user's UID for data isolation
3. **Server Timestamps**: All timestamps are server-generated for consistency

### Recommended Firestore Rules:
```javascript
match /users/{userId} {
  match /cart/{document=**} {
    allow read, write: if request.auth.uid == userId;
  }
  match /orders/{document=**} {
    allow read, write: if request.auth.uid == userId;
  }
}
```

## Performance Optimizations

1. **Lazy Loading**: Cart data only loads when user is logged in
2. **Memoization**: Components use useMemo to prevent unnecessary re-renders
3. **Server Timestamps**: Ensures all data is synchronized
4. **Efficient Updates**: Only modified fields are updated in Firestore

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Cart not updating
- Check if user is logged in
- Verify Firestore connection
- Check browser console for errors

### Orders not showing
- Ensure `loadOrders()` is called
- Check Firestore security rules
- Verify user UID is correct

### Checkout not working
- Ensure cart has items
- Check if user is authenticated
- Verify Firestore write permissions

## Future Enhancements

1. **Order Tracking**: Real-time order status updates
2. **Payment Integration**: Stripe/PayPal integration
3. **Wishlist**: Save items for later
4. **Cart Persistence**: Local storage backup
5. **Order Notifications**: Email/SMS notifications
6. **Admin Dashboard**: Manage orders and inventory
7. **Reviews**: Customer product reviews
8. **Inventory Management**: Stock tracking
