import type { ProductData } from "../types";

export const fetchRecommendations = async (): Promise<ProductData[]> => {
  const response = await fetch("/api/recommendations");
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: unknown = await response.json();
  return data as ProductData[];
};

export const fetchWishlist= async (): Promise<ProductData[]> => {
  const user_id = "user1"
  const response = await fetch(`/api/wishlist/${user_id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: unknown = await response.json();
  return data as ProductData[];
};

export const fetchSearch = async (): Promise<ProductData[]> => {
  const response = await fetch("/api/products/search");
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: unknown = await response.json();
  return data as ProductData[];
};

export const fetchProduct = async (product_id: string): Promise<ProductData[]> => {
  const response = await fetch(`/api/products/${product_id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data: unknown = await response.json();
  return data as ProductData[];
};
