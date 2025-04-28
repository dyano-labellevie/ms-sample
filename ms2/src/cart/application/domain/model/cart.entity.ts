import { CartItem } from './cart-item.entity';

export class Cart {
  private constructor(
    public readonly id: number,
    public readonly userUuid: string,
    public readonly cartCode: string,
    public readonly cartItems: CartItem[] = []
  ) {}

  public static init(
    id: number,
    userUuid: string,
    cartCode: string,
  ): Cart {
    return new Cart(id, userUuid, cartCode);
  }

  addItem(cartItem: CartItem): void {
    this.cartItems.push(cartItem);
  }
}
