// Literal union type — only two allowed color temperature values
// TypeScript will show an error if something else is passed, for example '3000K'
export type ColorTemp = '2700K' | '4000K';

// Structure of a single product in the catalog
export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  rating: number;
  sale: boolean;
  bestseller: boolean;
  image: string | null;
  desc: string;
}

// CartItem "inherits" all Product fields and adds its own
// This is better than copying all fields manually
export interface CartItem extends Product {
  qty: number;
  temp: ColorTemp;
}

// Structure of a slide in the Hero Showcase
// Differs from Product: no sale/bestseller, rating — string '4.8' (not a number!)
export interface HeroSlide {
  id: number;
  title: string;
  category: string;
  rating: number;
  price: number;
  image: string;        // in the slider there's always an image — null is not possible here
  desc: string;
}