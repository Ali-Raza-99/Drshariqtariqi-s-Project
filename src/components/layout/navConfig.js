export const userNavItems = [
  "Home",
  "Courses",
  "Products",
  "Library",
  "Ilm Ul Adad Calculator",
  "Khidmat e Khalq",
  "Mureed Counter",
  "Istikhara",
  "Appointment",
];

export const adminNavItems = [
  "Home",
  "Add Course",
  "Add Product",
  "Library",
  "Ilm Ul Adad Calculator",
  "Khidmat e Khalq",
  "Mureed Counter",
  "Istikhara",
  "Appointment",
];

// For backward compatibility
export const navItems = userNavItems;

export const routeByItem = {
  Home: "/",
  Courses: "/courses",
  Products: "/products",
  "Add Course": "/admin/courses",
  "Add Product": "/admin/products",
  Library: "/library",
  "Ilm Ul Adad Calculator": "/ilm-ul-adad-calculator",
  "Khidmat e Khalq": "/khidmat-e-khalq",
  "Mureed Counter": "/mureed-counter",
  Istikhara: "/istikhara",
  Appointment: "/appointment",
};

export function getNavItems(isAdmin) {
  return isAdmin ? adminNavItems : userNavItems;
}

export function getNavTo(item) {
  return routeByItem[item] ?? "/";
}

export function isNavItemActive(item, pathname) {
  const route = getNavTo(item);
  if (route === "/") return pathname === "/";
  return pathname.startsWith(route);
}
