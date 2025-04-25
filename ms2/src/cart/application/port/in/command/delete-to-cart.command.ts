/**
 * コマンドのインターフェース
 * このコマンドは、カートを削除するために使用される
 * コマンドはアダプタに実装される（外部からリクエストされるものであるため）
 */
export interface DeleteToCartCommand {
  cartId: number;
}
