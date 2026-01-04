export const navItems = [
  "Home",
  "Courses",
  "Library",
  "Product",
  "Ijtemai Qurbani",
  "Mureed Counter",
  "Ilm‑ul‑Adadad Calculator",
  "Istikhara",
  "Appointment",
];

export const routeByItem = {
  Home: "/",
  Courses: "/courses",
  Library: "/library",
  Product: "/products",
  "Ijtemai Qurbani": "/ijtemai-qurbani",
  "Mureed Counter": "/mureed-counter",
  "Ilm‑ul‑Adadad Calculator": "/ilm-ul-adadad-calculator",
  Istikhara: "/istikhara",
  Appointment: "/appointment",
};

export function getNavTo(item) {
  return routeByItem[item] ?? "/";
}

export function isNavItemActive(item, pathname) {
  const route = getNavTo(item);
  if (route === "/") return pathname === "/";
  return pathname.startsWith(route);
}
