import React, { createContext, useContext, useEffect, useState } from "react";
import {
  addToCart,
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  createOrder,
  getUserOrders,
} from "../firebase/firestore";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Load cart from Firestore when user logs in
  useEffect(() => {
    if (!currentUser?.uid) {
      setCartItems([]);
      setOrders([]);
      return;
    }

    const loadCart = async () => {
      try {
        setCartLoading(true);
        setCartError(null);
        const items = await getCartItems(currentUser.uid);
        setCartItems(items);
      } catch (err) {
        console.error("Error loading cart:", err);
        setCartError(err.message);
      } finally {
        setCartLoading(false);
      }
    };

    loadCart();
  }, [currentUser?.uid]);

  // Calculate cart totals
  const cartTotals = cartItems.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + (item.quantity ?? 0),
      totalAmount: acc.totalAmount + (item.price ?? 0) * (item.quantity ?? 0),
    }),
    { totalItems: 0, totalAmount: 0 }
  );

  // Add to cart
  const addToCartHandler = async (productData) => {
    if (!currentUser?.uid) {
      throw new Error("User must be logged in to add items to cart");
    }

    try {
      setCartError(null);
      const { id, name, price, image, imageUrl } = productData;
      
      await addToCart({
        uid: currentUser.uid,
        productId: id,
        productData: {
          name,
          price,
          image: image || imageUrl,
        },
        quantity: 1,
      });

      // Reload cart
      const items = await getCartItems(currentUser.uid);
      setCartItems(items);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setCartError(err.message);
      throw err;
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (!currentUser?.uid) {
      throw new Error("User must be logged in");
    }

    try {
      setCartError(null);
      await updateCartItemQuantity({
        cartItemId,
        quantity,
      });

      // Reload cart
      const items = await getCartItems(currentUser.uid);
      setCartItems(items);
    } catch (err) {
      console.error("Error updating quantity:", err);
      setCartError(err.message);
      throw err;
    }
  };

  // Remove from cart
  const removeItem = async (cartItemId) => {
    if (!currentUser?.uid) {
      throw new Error("User must be logged in");
    }

    try {
      setCartError(null);
      await removeCartItem(cartItemId);

      // Reload cart
      const items = await getCartItems(currentUser.uid);
      setCartItems(items);
    } catch (err) {
      console.error("Error removing from cart:", err);
      setCartError(err.message);
      throw err;
    }
  };

  // Place order (checkout)
  const checkout = async (additionalOrderData = {}) => {
    if (!currentUser?.uid) {
      throw new Error("User must be logged in to place order");
    }

    const activeItems = cartItems.filter(item => item.quantity > 0);
    
    if (activeItems.length === 0) {
      throw new Error("Cart is empty or all items have quantity 0");
    }

    try {
      setCartError(null);
      
      const totalItems = activeItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
      const totalAmount = activeItems.reduce((sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0), 0);
      
      const orderData = {
        items: activeItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        totalItems,
        totalAmount,
        ...additionalOrderData,
      };

      const orderRef = await createOrder({
        uid: currentUser.uid,
        orderData,
      });

      // Clear the cart after successful checkout
      await clearCart(currentUser.uid);
      setCartItems([]);

      return orderRef;
    } catch (err) {
      console.error("Error placing order:", err);
      setCartError(err.message);
      throw err;
    }
  };

  // Load checkouts/orders
  const loadOrders = async () => {
    if (!currentUser?.uid) {
      setOrders([]);
      return;
    }

    try {
      setOrdersLoading(true);
      const userOrders = await getUserOrders(currentUser.uid);
      setOrders(userOrders);
    } catch (err) {
      console.error("Error loading orders:", err);
      setCartError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Clear entire cart
  const clearCartHandler = async () => {
    if (!currentUser?.uid) {
      return;
    }

    try {
      setCartError(null);
      await clearCart(currentUser.uid);
      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
      setCartError(err.message);
      throw err;
    }
  };

  const value = {
    // Cart state
    cartItems,
    cartLoading,
    cartError,
    ...cartTotals,

    // Cart functions
    addToCart: addToCartHandler,
    updateQuantity,
    removeItem,
    clearCart: clearCartHandler,
    checkout,

    // Orders
    orders,
    ordersLoading,
    loadOrders,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
