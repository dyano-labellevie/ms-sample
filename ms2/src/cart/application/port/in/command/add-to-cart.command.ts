/**
 * コマンドのインターフェース
 * このコマンドは、カートに商品を追加するために使用される
 * コマンドはアダプタに実装される（外部からリクエストされるものであるため）
 */
export interface AddToCartCommand {
  id: number;
  userUuid: string;
  cartCode: string;
}
