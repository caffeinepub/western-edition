import {
  Category,
  Material,
  type Product,
  Room,
  Upholstery,
} from "../backend.d";

import imgBed1 from "../../public/assets/generated/product-bed-1.dim_800x800.jpg";
import imgBed2 from "../../public/assets/generated/product-bed-2.dim_800x800.jpg";
import imgDecor1 from "../../public/assets/generated/product-decor-1.dim_800x800.jpg";
import imgDining1 from "../../public/assets/generated/product-dining-1.dim_800x800.jpg";
import imgDining2 from "../../public/assets/generated/product-dining-2.dim_800x800.jpg";
import imgMedia1 from "../../public/assets/generated/product-media-1.dim_800x800.jpg";
import imgMedia2 from "../../public/assets/generated/product-media-2.dim_800x800.jpg";
// Static image imports so the build pipeline bundles them
import imgSofa1 from "../../public/assets/generated/product-sofa-1.dim_800x800.jpg";
import imgSofa2 from "../../public/assets/generated/product-sofa-2.dim_800x800.jpg";

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

export function getCategoryLabel(c: Category | string): string {
  switch (c) {
    case Category.sofa:
    case "sofa":
      return "Sofa";
    case Category.diningTable:
    case "diningTable":
      return "Dining Table";
    case Category.bed:
    case "bed":
      return "Bed";
    case Category.mediaUnit:
    case "mediaUnit":
      return "Media Unit";
    case "decor":
      return "Decor";
    default:
      return String(c);
  }
}

export function getRoomLabel(r: Room | string): string {
  switch (r) {
    case Room.living:
    case "living":
      return "Living Room";
    case Room.dining:
    case "dining":
      return "Dining Room";
    case Room.bedroom:
    case "bedroom":
      return "Bedroom";
    case "decor":
      return "Decor";
    default:
      return String(r);
  }
}

export function getProductImage(
  product: Product & { imageUrl?: string },
  index = 0,
): string {
  if (product.imageUrl) return product.imageUrl;
  switch (product.category) {
    case Category.sofa:
      return index % 2 === 0 ? imgSofa1 : imgSofa2;
    case Category.diningTable:
      return index % 2 === 0 ? imgDining1 : imgDining2;
    case Category.bed:
      return index % 2 === 0 ? imgBed1 : imgBed2;
    case Category.mediaUnit:
      return index % 2 === 0 ? imgMedia1 : imgMedia2;
    default:
      return imgDecor1;
  }
}

export function isValidPincode(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}
