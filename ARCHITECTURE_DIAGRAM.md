# System Architecture & Data Flow

## 📊 Component Hierarchy

```
App
├── AuthProvider
│   └── CartProvider
│       ├── Products
│       │   ├── ProductCard ×N
│       │   └── CartDialog
│       ├── Orders
│       └── [Other Pages]
```

## 🔄 Add to Cart Flow

```
┌─────────────────────────────────────────────────────────┐
│                  USER CLICKS "ADD TO CART"              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌─────────────────────────┐
         │  ProductCard Component  │
         │  - Check if logged in   │
         │  - Show login dialog    │
         └────────────┬────────────┘
                      │
                      ▼ (user logged in)
         ┌─────────────────────────┐
         │  Products.jsx           │
         │  - handleAddToCart()    │
         │  - calls useCart hook   │
         └────────────┬────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │  CartContext            │
         │  - addToCart()          │
         │  - Creates/Updates item │
         └────────────┬────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │  Firebase Firestore     │
         │  users/{uid}/cart/      │
         │  - Add or update item   │
         └────────────┬────────────┘
                      │
                      ▼
         ┌─────────────────────────┐
         │  CartDialog Updates     │
         │  - Fetches new data     │
         │  - Renders items        │
         └──────────────────────────┘
```

## 🛒 Cart Management Flow

```
┌───────────────────────────────────────────────────────┐
│              CART DIALOG OPENED                       │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
    ┌──────────────────────────┐
    │  useCart() Hook          │
    │  - cartItems             │
    │  - totalItems            │
    │  - totalAmount           │
    └──────────────┬───────────┘
                   │
     ┌─────────────┴─────────────┐
     │                           │
     ▼                           ▼
┌──────────────┐         ┌──────────────┐
│  Display     │         │  Action      │
│  Items List  │         │  Buttons     │
├──────────────┤         ├──────────────┤
│ • Image      │         │ • +/- qty    │
│ • Name       │         │ • Remove     │
│ • Price      │         │ • Checkout   │
│ • Quantity   │         └──────────────┘
└──────┬───────┘                │
       │                        │
       │    ┌───────────────────┘
       │    │
       ▼    ▼
    ┌──────────────────┐
    │  User Action     │
    │  - Change qty    │
    │  - Remove item   │
    │  - Checkout      │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │  CartContext     │
    │  - updateQty()   │
    │  - removeItem()  │
    │  - checkout()    │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │  Firestore       │
    │  Update/Delete   │
    │  Data            │
    └────────┬─────────┘
             │
             ▼
    ┌──────────────────┐
    │  Component       │
    │  Re-renders      │
    │  with new data   │
    └──────────────────┘
```

## ✅ Checkout Flow

```
┌──────────────────────────────────┐
│   USER CLICKS "CHECKOUT"         │
└────────────────┬─────────────────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │  CartDialog             │
    │  - handleCheckout()     │
    │  - Show loading         │
    └────────────┬────────────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │  CartContext.checkout() │
    │  - Prepare order data   │
    │  - Include all items    │
    │  - Add total & count    │
    └────────────┬────────────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │  Firestore - Create     │
    │  Order in               │
    │  users/{uid}/orders/    │
    └────────────┬────────────┘
                 │
                 ▼ (success)
    ┌─────────────────────────┐
    │  Firestore - Delete     │
    │  All items from         │
    │  users/{uid}/cart/      │
    └────────────┬────────────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │  CartContext Updates    │
    │  - cartItems = []       │
    │  - totalItems = 0       │
    │  - totalAmount = 0      │
    └────────────┬────────────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │  Dialog Closes          │
    │  Success Message        │
    │  Shows                  │
    └─────────────────────────┘
```

## 📋 View Orders Flow

```
┌──────────────────────────────┐
│  USER NAVIGATES TO /orders   │
└────────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │  Orders Component        │
    │  - useEffect()           │
    │  - loadOrders()          │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │  CartContext             │
    │  - getUserOrders(uid)    │
    │  - Query Firestore       │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │  Firestore               │
    │  users/{uid}/orders/     │
    │  - Fetch all orders      │
    └────────────┬─────────────┘
                 │
                 ▼ (orders loaded)
    ┌──────────────────────────┐
    │  Orders Component        │
    │  - Display order list    │
    │  - Show expandable       │
    │    details               │
    │  - Allow filtering by    │
    │    status                │
    └──────────────────────────┘
```

## 🔐 Authentication Check Flow

```
┌──────────────────────────┐
│  USER CLICKS + ON CARD   │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│  ProductCard.jsx         │
│  increaseQty()           │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────────┐
│  requireLoginOr()            │
│  Check: currentUser exists?  │
└────────────┬────────────────┘
             │
        ┌────┴─────┐
        │           │
   NO   │           │ YES
    ▼   │           ▼
┌──────────────┐  ┌──────────────┐
│  Show Login  │  │  Add to      │
│  Dialog      │  │  Cart via    │
│              │  │  handleAdd() │
└──────────────┘  └──────────────┘
```

## 📊 State Flow Diagram

```
┌──────────────────────────────────────────────────┐
│           CARTCONTEXT STATE                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  cartItems []                                    │
│    ├── id, productId, name, price, image        │
│    ├── quantity, addedAt, updatedAt             │
│    └── ...                                       │
│                                                  │
│  Computed Values:                               │
│    ├── totalItems (sum of quantities)           │
│    ├── totalAmount (sum of subtotals)           │
│    ├── cartLoading (boolean)                    │
│    └── cartError (string or null)               │
│                                                  │
│  Actions:                                       │
│    ├── addToCart(productData)                   │
│    ├── updateQuantity(cartItemId, qty)          │
│    ├── removeItem(cartItemId)                   │
│    ├── checkout(additionalData)                 │
│    ├── clearCart()                              │
│    ├── loadOrders()                             │
│    └── orders []                                │
│                                                  │
│  Order State:                                   │
│    ├── ordersLoading (boolean)                  │
│    ├── orders (from Firestore)                  │
│    └── Each order has:                          │
│        ├── id, items[], totalItems              │
│        ├── totalAmount, status                  │
│        ├── placedAt, updatedAt                  │
│        └── deliveryAddress, notes               │
│                                                  │
└──────────────────────────────────────────────────┘
```

## 🔄 Real-time Sync

```
User 1 (Browser 1)          User 2 (Browser 2)
    │                              │
    ├─ Add Item ──────┐           │
    │                  ▼           │
    │           ┌───────────────┐  │
    │           │  Firestore    │  │
    │           │  users/1/cart │  │
    │           └───────┬───────┘  │
    │                   │           │
    │                   └──────────>│
    │                               │
    │                   ┌─ Listener─┤
    │                   │           │
    │<──────────────────┤ Re-render │
    │    Auto Update    │           │
    │                   │           │
    └──────────────────────────────┘
```

## 📱 Component Communication

```
                    ┌──────────────┐
                    │ CartProvider │
                    │  (Context)   │
                    └──────┬───────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │ Products   │  │ CartDialog │  │  Orders    │
    │ Component  │  │ Component  │  │ Component  │
    └────────────┘  └────────────┘  └────────────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                    ┌──────┴───────┐
                    │   useCart()  │
                    │     Hook     │
                    └──────┬───────┘
                           │
                   ┌───────┴────────┐
                   │                │
                   ▼                ▼
           ┌──────────────┐  ┌────────────────┐
           │  Firebase    │  │  Local State   │
           │  Firestore   │  │  (CartContext) │
           └──────────────┘  └────────────────┘
```

This architecture ensures:
✅ Single source of truth (Firestore)
✅ Real-time synchronization
✅ Clean component communication
✅ Easy to test and maintain
✅ Scalable for future features
