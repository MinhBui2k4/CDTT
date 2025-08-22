export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    oldPrice: number | null;
    rating: number;
    review: number;
    image: string | null;
    images: string[] | null;
    quantity: number;
    categoryId: number;
    brandId: number;
    sku: string;
    availability: boolean;
    new: boolean;
    sale: boolean;
  }