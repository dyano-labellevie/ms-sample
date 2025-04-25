/**
 * コマンドのインターフェース
 * このコマンドは、カートに商品を追加するために使用される
 * コマンドはアダプタに実装される（外部からリクエストされるものであるため）
 */
export interface AddToCartItemCommand {
  id: number;
  skuCode: string;
  price: number;
  quantity: number;
  cartId: number;
}
