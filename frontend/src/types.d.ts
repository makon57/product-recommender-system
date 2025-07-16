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

export interface User {
  user_id: string,
  email: string,
  age: number,
  gender: string,
  signup_date: date,
  preferences: string,
}
