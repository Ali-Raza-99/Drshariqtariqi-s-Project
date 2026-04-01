# Checkout Feature - Quick Start Guide

## For Users

### How to Checkout

1. **Add Products to Cart**
   - Browse products on the Product page
   - Click the + button on desired items to add to cart
   - Adjust quantities as needed

2. **Open Checkout**
   - **Option A**: Click the green "Checkout" button in the navbar
   - **Option B**: Click the shopping cart icon → Click "Checkout" in the cart dialog

3. **Fill Delivery Information**
   - **Full Name**: Your complete name
   - **Email**: Your email address (auto-filled if logged in)
   - **Phone Number**: Your mobile number (format: 03001234567)
   - **City**: Your city name
   - **Delivery Address**: Complete address for delivery

4. **Make Payment**
   - Review the order total and bank details
   - Transfer the amount to the displayed account details:
     - **Bank**: HBL
     - **Account: Muhammad Shariq**
     - **IBAN**: PK25 HABB 00244070000008303
     - **Branch**: Bara Market Branch

5. **Upload Payment Slip**
   - Click "Upload Payment Slip" button
   - Select your payment screenshot/receipt (JPG, PNG, or PDF)
   - Preview will appear below the upload button

6. **Place Order**
   - Review all information
   - Click "Place Order" button
   - Wait for success message (appears after upload completes)
   - You'll receive an order confirmation

---

## For Developers

### Component Structure

```
CheckoutDialog
├── Order Summary Section
│   ├── Product List
│   └── Total Amount
├── Delivery Information Section
│   ├── Text Fields (Name, Email, Phone)
│   ├── City Input
│   └── Address Textarea
├── Payment Section
│   ├── Bank Details Display
│   ├── File Upload
│   ├── File Preview
│   └── Info Alert
└── Action Buttons (Cancel, Place Order)
```

### Props

```javascript
<CheckoutDialog
  open={boolean}        // Dialog visibility
  onClose={function}    // Callback when dialog closes
/>
```

### State Management

```javascript
// Form Data
{
  name: string,
  email: string,
  phone: string,
  address: string,
  city: string
}

// File Upload
paymentSlip: File | null
paymentSlipPreview: string | null

// UI State
submitting: boolean
error: string
successMsg: string
```

### Hooks Used

```javascript
useAuth()        // Get logged-in user
useCart()        // Get cart items and checkout function
```

---

## Required Dependencies

All dependencies are already installed:
- React & Material-UI (MUI)
- Firebase & Firestore
- Cloudinary (for file upload)
- React Router

No additional packages needed!

---

## Environment Variables Required

Ensure your `.env` file contains:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned_upload_preset
```

These are used for payment slip file uploads.

---

## Firebase Configuration

Ensure Firestore has an "orders" collection with these security rules:

```javascript
// Allow authenticated users to create orders
allow create: if request.auth.uid != null;

// Allow users to read their own orders
allow read: if request.auth.uid == resource.data.uid;
```

---

## Customization

### Change Bank Details

Edit [CheckoutDialog.jsx](src/components/cart/CheckoutDialog.jsx), lines ~300-320:

```javascript
<Box>
  <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
    Bank Name
  </Typography>
  <Typography fontWeight={600} sx={{ fontSize: 14 }}>
    HBL  // Change this
  </Typography>
</Box>
```

### Change Checkout Button Color

Edit [Products.jsx](src/components/Products.jsx), search for "Checkout" button styling:

```javascript
sx={{
  bgcolor: "rgba(76, 175, 80, 0.85)",  // Current green color
  // Change to desired color
}}
```

### Change Success Message

Edit [CheckoutDialog.jsx](src/components/cart/CheckoutDialog.jsx), line ~152:

```javascript
setSuccessMsg("Order placed successfully! We will contact you soon.");
// Change the message above
```

---

## Testing the Feature

### Test Scenario 1: Basic Checkout
1. Add items to cart
2. Click checkout
3. Fill form with test data
4. Upload test payment slip
5. Click "Place Order"
6. ✅ Should show success message

### Test Scenario 2: Form Validation
1. Try clicking "Place Order" without filling form
2. ✅ Should show "Please enter..." error messages

### Test Scenario 3: Empty Cart
1. Remove all items from cart
2. Try opening checkout
3. ✅ Submit button should stay disabled

### Test Scenario 4: Payment Slip Required
1. Fill all form fields
2. Don't upload payment slip
3. ✅ Submit button should be disabled

### Test Scenario 5: File Upload
1. Fill form
2. Upload payment slip
3. ✅ File preview should appear
4. ✅ Submit button should enable

---

## Troubleshooting Guide

### Problem: Checkout button not appearing
```
Solution: 
1. Make sure you're logged in
2. Refresh the page
3. Check browser console for errors
```

### Problem: File upload fails
```
Solution:
1. Check file size (should be < 100MB)
2. Check file format (JPG, PNG, PDF)
3. Verify Cloudinary credentials in .env
4. Check network connection
```

### Problem: Order not saving
```
Solution:
1. Verify user is authenticated
2. Check Firestore rules allow order creation
3. Check Firebase Console for errors
4. Ensure "orders" collection exists in Firestore
```

### Problem: Form fields blank after refresh
```
Solution:
This is normal - form data is cleared for security
```

### Problem: Bank details not displaying
```
Solution:
1. Refresh the page
2. Check CheckoutDialog.jsx for syntax errors
3. Ensure internet connection active
```

---

## Success Indicators

✅ Checkout button visible in navbar (green color)
✅ Dialog opens with complete form
✅ Bank details displayed correctly
✅ File upload works with preview
✅ Form validates before submission
✅ Success message appears after checkout
✅ Order appears in Firebase Console
✅ Payment slip URL saved in order data
✅ Cart clears after successful checkout
✅ Email pre-fills from user account

---

## Performance Tips

1. **Reduce Image Size**: Compress payment slip images before upload
2. **Clear Cache**: If experiencing issues, clear browser cache
3. **Use Modern Browser**: Chrome/Firefox recommended
4. **Close Other Tabs**: If upload is slow, close other resource-heavy tabs

---

## Support

For issues or questions:
1. Check [CHECKOUT_IMPLEMENTATION.md](CHECKOUT_IMPLEMENTATION.md) for technical details
2. Review error messages in browser console
3. Check Firebase Console for backend errors
4. Verify all required .env variables are set

---

## FAQ

**Q: Can I change the payment amount?**
A: The amount is calculated from cart items and cannot be manually changed.

**Q: What file formats are accepted?**
A: JPG, PNG, GIF, WebP, and PDF files are supported.

**Q: How long does file upload take?**
A: Usually 2-5 seconds depending on file size and internet speed.

**Q: Is my payment information secure?**
A: Payment details are handled through Cloudinary's secure infrastructure.

**Q: Can I edit my order after checkout?**
A: Currently, orders cannot be edited after submission. Contact support for changes.

**Q: When will I receive my order?**
A: You'll be contacted after payment verification (usually within 24 hours).

---

## Version History

- **v1.0** (2024-04) - Initial checkout implementation
  - Order summary display
  - Delivery information form
  - Bank details display
  - Payment slip upload
  - Firebase integration
  - Form validation

---

Last Updated: April 2024
