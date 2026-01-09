// Navigation items for unlogged users (public) - same as logged-in users
export const publicNavItems = [
  "Home",
  "Courses",
  "Products",
  "Khidmat e Khalq",
  "Mureed Registry",
  "Appointment",
];

// Navigation items for logged-in users
export const userNavItems = [
  "Home",
  "Courses",
  "Products",
  "Khidmat e Khalq",
  "Mureed Registry",
  "Appointment",
];

// Navigation items for admin users
export const adminNavItems = [
  "Home",
  "Add Course",
  "Add Product",
  "Khidmat e Khalq",
  "Mureed's Requests",
  "View Appointment",
];

// For backward compatibility
export const navItems = userNavItems;

export const routeByItem = {
  Home: "/",
  Courses: "/courses",
  Products: "/products",
  "Add Course": "/admin/courses",
  "Add Product": "/admin/products",
  "Khidmat e Khalq": "/khidmat-e-khalq",
  "Mureed Registry": "/mureed-counter",
  "Mureed's Requests": "/admin/mureed-requests",
  Appointment: "/appointment",
  "View Appointment": "/admin/appointments",
};

export function getNavItems(isAdmin, isLoggedIn) {
  if (isAdmin) return adminNavItems;
  return userNavItems; // Both logged-in and unlogged users see the same
}

export function getNavTo(item) {
  return routeByItem[item] ?? "/";
}

export function isNavItemActive(item, pathname) {
  const route = getNavTo(item);
  if (route === "/") return pathname === "/";
  return pathname.startsWith(route);
}
