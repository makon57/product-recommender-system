export interface ProductData {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
}

export interface CartItem {
  userId: string;
  productId: string;
}
