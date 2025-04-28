export class CartItem {
  private constructor(
    public readonly id: number,
    public readonly skuCode: string,
    public readonly price: number,
    public readonly quantity: number,
    public readonly cartId: number
  ) {}

  public static init(
    id: number,
    skuCode: string,
    price: number,
    quantity: number,
    cartId: number
  ): CartItem {
    return new CartItem(id, skuCode, price, quantity, cartId);
  }
}
