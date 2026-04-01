# Data Fetching Architecture - Guest User Support

## Overview
This document explains how data fetching works for both guest (unauthenticated) and logged-in users.

---

## Current Architecture

### Components Using Firestore Data

#### 1. Products.jsx
- **Data Source:** Firestore `products` collection
- **Fetch Function:** `listProducts()` from firestore.js
- **Query:** Ordered by `createdAt` (newest first)
- **Access:** Public (guest + authenticated users)

**Current Implementation:**
```javascript
// Fetch products from Firestore
const data = await listProducts();  // Works if rules allow

// Fallback if fetch fails (temporary hardcoded data)
const fallbackProducts = [
  { id: "oil", name: "Oil", price: 1200, imageUrl: oilImg },
  { id: "bakhor", name: "Bakhor", price: 1500, imageUrl: bakhorImg },
  { id: "powder", name: "Powder", price: 900, imageUrl: powderImg },
];
```

**Error Handling:**
- If permission-denied: Use fallback images
- If empty result: Use fallback images
- If network error: Use fallback images
- Log all errors to console for debugging

#### 2. Courses.jsx
- **Data Source:** Firestore `courses` collection
- **Fetch Function:** `listCourses()` from firestore.js
- **Query:** Ordered by `createdAt` (newest first)
- **Access:** Public (guest + authenticated users)

**Current Implementation:**
```javascript
// Fetch courses from Firestore
const data = await listCourses();  // Works if rules allow

// Fallback if fetch fails (empty array)
const fallbackCourses = [];  // No courses if database fails
```

---

## Why Fallback Data Exists

### Temporary Measure During Development
```
Graph: Data Availability During Rule Update

Before Rules Fix     During Fix          After Rules Fix
─────────────────    ──────────────      ────────────────
Guest: ❌            Guest: ✅ (DB)      Guest: ✅ (DB)
       ↓ Falls back         ↓                  ↓
      Fallback        Real Data         Real Data
      Images                             (Dynamic)
```

### Why We Have Fallback Images
1. **Development Testing:** Test UI without Firestore access
2. **Rule Migration:** Grace period while rules are updated
3. **Error Resilience:** If Firestore is temporarily down
4. **User Experience:** Better to show something than nothing

### Image Sources
- `oil.jpeg` - Local asset at `src/assets/oil.jpeg`
- `bakhor.jpeg` - Local asset at `src/assets/bakhor.jpeg`
- `powder.jpeg` - Local asset at `src/assets/powder.jpeg`

These are only shown if Firestore returns no data.

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ User Visits Product Page (Guest or Logged-in)              │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
          ┌──────────────────────────┐
          │ useEffect runs on mount  │
          └──────────────┬───────────┘
                         ↓
          ┌──────────────────────────────────┐
          │ Call listProducts() from Firestore│
          └──────────────┬───────────────────┘
                         ↓
                 ┌───────────────┐
                 │  Query works? │
                 └───┬───────┬───┘
                     │       │
                 YES │       │ NO
                     ↓       ↓
            ┌─────────────┐  ┌────────────────────┐
            │ Display DB  │  │ Permission Denied? │
            │ Products    │  └─────────┬──────────┘
            │ (Real Data) │            │
            └─────────────┘     ┌──────┴──────────┐
                                │                 │
                               YES               NO
                                │                 │
                   ┌────────────┴────────┐  ┌────┴──────────┐
                   │ Use Fallback Images  │  │ Use Fallback  │
                   │ (Hardcoded OS, Vol)  │  │ Images        │
                   │ + Log Security Error  │  │               │
                   └─────────────────────┘  └───────────────┘
                                │                 │
                                └────────┬────────┘
                                         ↓
                              ┌──────────────────┐
                              │ Display Products │
                              │ to User          │
                              └──────────────────┘
```

---

## Guest User Journey (Current vs Fixed)

### BEFORE Fix (Current - Broken)
```
1. Guest visits /products
2. Component calls listProducts()
3. Firestore denies access (permission-denied)
4. Falls back to hardcoded images: Oil, Bakhor, Powder
5. Shows static fallback ❌ NOT real data
```

### AFTER Fix (With Updated Security Rules)
```
1. Guest visits /products
2. Component calls listProducts()
3. Firestore grants read access ✅
4. Returns all products from database
5. Shows dynamic real data ✅ from Firestore
```

---

## Authenticated User Journey

### Current (Works)
```
1. Logged-in user visits /products
2. Component calls listProducts()
3. Firestore grants access (authenticated)
4. Returns all products from database
5. Shows real data ✅
```

### After Fix (Still Works)
```
1. Logged-in user visits /products
2. Component calls listProducts()
3. Firestore grants access (authenticated)
4. Returns all products from database
5. Shows real data ✅
```

---

## The Core Issue

### What's Happening Now
```javascript
// Firestore rules likely look like this (WRONG):
match /products/{doc} {
  allow read: if request.auth != null;  // ❌ Requires authentication
}

// Result for guest users:
try {
  const data = await listProducts();  // ❌ Permission denied
} catch (error) {
  if (error.code === 'permission-denied') {
    // Use hardcoded fallback
    setProducts(fallbackProducts);  // Shows Oil, Bakhor, Powder
  }
}
```

### What Should Happen
```javascript
// Firestore rules should be (CORRECT):
match /products/{doc} {
  allow read: if true;  // ✅ Anyone can read (public data)
  allow write: if request.auth != null && isAdmin;  // Only admins can write
}

// Result for guest users:
try {
  const data = await listProducts();  // ✅ Access granted
  if (data.length > 0) {
    setProducts(data);  // ✅ Shows real products from DB
  }
} catch (error) {
  // This error shouldn't happen for reads anymore
  setProducts(fallbackProducts);  // Fallback only for true errors
}
```

---

## Implementation Status

### Components Modified
- ✅ **Products.jsx** - Has data fetching with fallback
- ✅ **Courses.jsx** - Has data fetching with fallback
- ✅ **Firestore Queries** - Rules-agnostic (work with any auth level)

### What's Needed
- ⚠️ **Firestore Security Rules** - MUST be updated to allow guest read access
- 📋 **Configuration** - Via Firebase Console (manual step)

---

## Solution Checklist

### Phase 1: Identify Issue (✓ Complete)
- [x] Confirm permission-denied errors in console
- [x] Verify fallback data is being used
- [x] Understand root cause (security rules)

### Phase 2: Fix Security Rules (⚠️ REQUIRED)
- [ ] Go to Firebase Console
- [ ] Navigate to Firestore Rules
- [ ] Update rules for public read access
- [ ] Publish rules and wait for deployment
- [ ] **See: FIRESTORE_SECURITY_RULES.md for exact rules**

### Phase 3: Verify Fix (⚠️ REQUIRED)
- [ ] Open browser DevTools Console
- [ ] Visit /products as guest
- [ ] Should see: `✅ Products fetched: [real products]`
- [ ] Should NOT see: permission-denied error
- [ ] Repeat for /courses page

### Phase 4: Cleanup (Optional)
- [ ] Remove fallback hardcoded images eventually
- [ ] Keep fallback for error resilience only
- [ ] Monitor Firestore query errors in production

---

## Best Practices Implemented

### 1. Proper Error Handling
```javascript
try {
  const data = await listProducts();
  setProducts(data.length > 0 ? data : fallbackProducts);
} catch (error) {
  if (error.code === 'permission-denied') {
    console.error('Security rules need update');
  }
  setProducts(fallbackProducts);
}
```

### 2. Cleanup on Unmount
```javascript
React.useEffect(() => {
  let cancelled = false;
  // Fetch data...
  return () => {
    cancelled = true;  // Prevent state updates on unmounted component
  };
}, []);
```

### 3. Logging for Debugging
```javascript
console.log('✅ Products fetched:', data);
console.log('📊 Product count:', data?.length);
console.error('🔐 FIRESTORE SECURITY RULES ARE BLOCKING ACCESS');
```

### 4. Works for Both User Types
```javascript
// Guest user: 
// 1. Try Firestore (fails if rules block)
// 2. Use fallback

// Logged-in user:
// 1. Try Firestore (works if authenticated)
// 2. Never needs fallback
```

---

## Performance Implications

### Current State
- **Guest users:** Fast fallback (local images)
- **Logged-in users:** Query from Firestore (1-2s typical)

### After Fix
- **Guest users:** Query from Firestore (1-2s typical)
- **Logged-in users:** Query from Firestore (1-2s typical)
- **Admin users:** Query from Firestore (1-2s typical)

### Optimization Tips
- Firestore queries are indexed by default (fast)
- orderBy("createdAt") uses server-side ordering
- Consider pagination for large datasets
- No N+1 queries (each product fetched once)

---

## Monitoring & Debugging

### Console Logs to Check
```
✅ Indicates successful operation
❌ Indicates error condition
⚠️ Indicates potential issue
🔐 Indicates security issue
📊 Indicates metric/count
```

### Troubleshooting Commands
```javascript
// In browser console:

// Test guest access
fetch('your-firebase-url/products')
  .then(r => r.json())
  .then(d => console.log('Guest access:', d.length, 'items'))
  .catch(e => console.error('Guest access failed:', e.message))

// Test authenticated access
// (only works if logged in)
```

---

## Next Steps

1. **Update Firestore Rules** → See FIRESTORE_SECURITY_RULES.md
2. **Test Guest User Access** → Open /products as guest
3. **Verify Console Logs** → Check DevTools for success messages
4. **Monitor for Errors** → Watch for permission-denied in production
5. **Consider Caching** → Add Redis caching in future for performance

---

**File Status:** Ready for implementation  
**Last Updated:** April 1, 2026  
**Critical Issue:** Firestore rules must be updated

