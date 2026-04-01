# Firestore Security Rules - Guest User Data Access Fix

## Problem Identified
Guest users (unauthenticated) are unable to access products and courses because Firestore Security Rules are restricting read access to authenticated users only.

Error in console logs:
```
🔐 FIRESTORE SECURITY RULES ARE BLOCKING GUEST ACCESS
❌ Error Code: permission-denied
```

---

## Solution: Update Firestore Security Rules

### Current Rules (BLOCKING GUESTS)
Your current rules likely look like this:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;  // ❌ Blocks guests
    }
  }
}
```

### Required Rules (ALLOW GUESTS)
Replace with these rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ✅ Products: Public read access for guest users
    match /products/{productId} {
      allow read: if true;  // Anyone can read
      allow create, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // ✅ Courses: Public read access for guest users
    match /courses/{courseId} {
      allow read: if true;  // Anyone can read
      allow create, update, delete: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // ✅ Users: Only authenticated users can read their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;  // Prevent deletion
    }
    
    // Cart: Only authenticated users can write, anyone can read
    match /cart/{cartItem} {
      allow read: if true;
      allow create, update, delete: if request.auth != null;
    }
    
    // Orders: Only authenticated users can access
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    // Appointments: Only authenticated users can access
    match /Appointment/{appointmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Mureed Requests: Only authenticated users can access
    match /mureeds/{mureedId} {
      allow read, write: if request.auth != null;
    }
    
    // Qurbani: Only authenticated users can access
    match /qurbaniAnimals/{animalId} {
      allow read, write: if request.auth != null;
    }
    
    match /qurbaniBanks/{bankId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## How to Update Rules in Firebase Console

### Step 1: Go to Firebase Console
1. Visit: https://console.firebase.google.com
2. Select your project

### Step 2: Navigate to Firestore Rules
1. Click **Firestore Database** in left sidebar
2. Click **Rules** tab at the top
3. Copy the rules above
4. Paste into the rules editor
5. Click **Publish** button

### Step 3: Wait for Deployment
- Rules typically deploy within 1-2 minutes
- You'll see a success message when complete

---

## Security Explanation

### Why These Rules Work:

**Products & Courses Collections:**
- `allow read: if true;` = **Anyone** (guests + authenticated users) can read
- `allow create, update, delete: if admin` = **Only admins** can modify
- Guests can view catalog, admins control inventory

**Users Collection:**
- Users can only read/write their own profile (privacy)
- Prevents guests from accessing user data

**Cart & Orders:**
- Only authenticated users can create/modify
- Guests cannot save cart to database
- Public read to allow cart display on public pages

**Admin-Only Collections:**
- Appointments, Mureeds, Qurbani require authentication
- These are internal admin operations

---

## Testing After Rules Update

### Test 1: Guest User Can View Products
```javascript
// Should work (no error)
const products = await listProducts();  // Guest user
console.log('✅ Products loaded for guest:', products.length);
```

### Test 2: Guest User Can View Courses
```javascript
// Should work (no error)
const courses = await listCourses();  // Guest user
console.log('✅ Courses loaded for guest:', courses.length);
```

### Test 3: Admin Can Still Create Products
```javascript
// Should work (admin user)
const newProduct = await createProduct({ data: {...} });
console.log('✅ Product created by admin');
```

### Test 4: Guest Cannot Create Products
```javascript
// Should fail with permission-denied (expected)
const newProduct = await createProduct({ data: {...} });
// Error: permission-denied ✅ Correct behavior
```

---

## Expected Behavior After Fix

### Before Fix (Current - Broken)
```
Guest User Actions:
- View Products ❌ (permission-denied)
- View Courses ❌ (permission-denied)
- Add to Cart ✅ (local storage only)
- Checkout ✅ (creates order document)
↓
Falls back to hardcoded images: Oil, Bakhor, Powder
```

### After Fix (This Solution)
```
Guest User Actions:
- View Products ✅ (fetches from Firestore)
- View Courses ✅ (fetches from Firestore)
- Add to Cart ✅ (local state in CartContext)
- Checkout ✅ (redirects to login)
↓
Displays real data from database
```

---

## Additional Notes

### Cart State Management
- **Guest users**: Cart data stored in `CartContext` (local state) - not persisted
- **Logged-in users**: Cart data stored in Firestore `cart` collection - persisted across sessions
- This is intentional design (guests don't need persistent cart)

### Product/Course Images
- Images stored in Firestore document `imageUrl` field
- Uses Cloudinary URLs or direct URLs
- Fallback images only used if database query fails

### Performance Considerations
- Public read access for products/courses is safe (no sensitive data)
- Admin actions (create/update/delete) still require authentication
- Rules are evaluated at read time (stateless, performant)

---

## Rollout Checklist

- [ ] Navigate to Firebase Console
- [ ] Update Firestore Security Rules
- [ ] Deploy rules (wait for success message)
- [ ] Refresh browser and clear cache
- [ ] Open browser DevTools Console
- [ ] Visit `/products` page as guest user
- [ ] Verify console logs show: `✅ Products fetched: [array]`
- [ ] Visit `/courses` page as guest user
- [ ] Verify console logs show: `✅ Courses fetched: [array]`
- [ ] Test add to cart (no login required)
- [ ] Test checkout (should prompt for login if guest)

---

## Troubleshooting

### Issue: Still Getting "permission-denied" Error
**Solution:**
1. Verify rules were published successfully
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh page (Ctrl+Shift+R)
4. Wait 2-3 minutes for rules to fully propagate

### Issue: Products/Courses Show But With Fallback Images
**Solution:**
1. Check that `imageUrl` field exists in Firestore documents
2. Verify images are uploaded to Cloudinary
3. Check browser console for specific errors

### Issue: Admin Functions Stopped Working
**Solution:**
1. Verify admin user has `role: "admin"` in Firestore users collection
2. Check that admin user is logged in
3. Verify no typos in collection names

---

## Files Affected by This Fix

1. **src/components/Products.jsx**
   - useEffect fetches from Firestore, fallback to hardcoded data
   - Works for guest users after rules update

2. **src/components/Courses.jsx**
   - useEffect fetches from Firestore, fallback to hardcoded data
   - Works for guest users after rules update

3. **src/firebase/firestore.js**
   - `listProducts()` - queries products collection (no auth required)
   - `listCourses()` - queries courses collection (no auth required)
   - These work for both guest and authenticated users

---

## Success Criteria

After implementing this fix:

✅ Guest users can see products and courses  
✅ Data loads from Firestore (not static/hardcoded)  
✅ Both guest and logged-in users see same data  
✅ Admin functions still require authentication  
✅ No console errors for permission-denied  
✅ Performance is not impacted  

---

## Related Documentation
- [Firebase Security Rules Guide](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Authentication States](https://firebase.google.com/docs/auth/manage-users)
- [Firestore Query Performance](https://firebase.google.com/docs/firestore/best-practices)

---

**Status:** Ready to implement
**Priority:** High (Blocks guest user access)
**Effort:** 5 minutes (Update rules in Firebase Console)

