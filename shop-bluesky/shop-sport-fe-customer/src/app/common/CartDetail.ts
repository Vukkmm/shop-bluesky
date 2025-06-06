import { Cart } from './Cart';
import { Product } from './Product';

export class CartDetail {
  'cartDetailId': number;
  'quantity': number;
  'price': number;
  'product': Product;
  'cart': Cart;
  'size': string;
  checked: boolean = false;
  constructor(
    id: number,
    quantity: number,
    price: number,
    product: Product,
    cart: Cart,
    size: string
  ) {
    this.cartDetailId = id;
    this.quantity = quantity;
    this.price = price;
    this.product = product;
    this.cart = cart;
    this.size = size;
  }
}
