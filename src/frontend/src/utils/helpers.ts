import {
  Category,
  Material,
  type Product,
  Room,
  Upholstery,
} from "../backend.d";

export function formatINR(price: bigint): string {
  const num = Number(price);
  // Indian number formatting: xx,xx,xxx
  const s = num.toString();
  if (s.length <= 3) return `₹${s}`;

  const lastThree = s.slice(-3);
  const rest = s.slice(0, -3);
  const formatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `₹${formatted},${lastThree}`;
}

export function getMaterialLabel(m: Material): string {
  switch (m) {
    case Material.matteWalnut:
      return "Matte Walnut";
    case Material.naturalTeak:
      return "Natural Teak";
    case Material.charcoalAsh:
      return "Charcoal Ash";
    default:
      return m;
  }
}

export function getUpholsteryLabel(u: Upholstery): string {
  switch (u) {
    case Upholstery.italianVelvet:
      return "Italian Velvet";
    case Upholstery.performanceBoucle:
      return "Performance Bouclé";
    default:
      return u;
  }
}

export function getCategoryLabel(c: Category): string {
  switch (c) {
    case Category.sofa:
      return "Sofa";
    case Category.diningTable:
      return "Dining Table";
    case Category.bed:
      return "Bed";
    case Category.mediaUnit:
      return "Media Unit";
    default:
      return c;
  }
}

export function getRoomLabel(r: Room): string {
  switch (r) {
    case Room.living:
      return "Living Room";
    case Room.dining:
      return "Dining Room";
    case Room.bedroom:
      return "Bedroom";
    default:
      return r;
  }
}

export function getProductImage(product: Product, index = 0): string {
  switch (product.category) {
    case Category.sofa:
      return index % 2 === 0
        ? "/assets/generated/product-sofa-1.dim_800x800.jpg"
        : "/assets/generated/product-sofa-2.dim_800x800.jpg";
    case Category.diningTable:
      return index % 2 === 0
        ? "/assets/generated/product-dining-1.dim_800x800.jpg"
        : "/assets/generated/product-dining-2.dim_800x800.jpg";
    case Category.bed:
      return index % 2 === 0
        ? "/assets/generated/product-bed-1.dim_800x800.jpg"
        : "/assets/generated/product-bed-2.dim_800x800.jpg";
    case Category.mediaUnit:
      return index % 2 === 0
        ? "/assets/generated/product-media-1.dim_800x800.jpg"
        : "/assets/generated/product-media-2.dim_800x800.jpg";
    default:
      return "/assets/generated/product-sofa-1.dim_800x800.jpg";
  }
}

export function isValidPincode(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}
