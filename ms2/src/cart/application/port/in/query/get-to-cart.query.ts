/**
 * クエリのインターフェース
 * このクエリは、カートを取得するために使用される
 * クエリはアダプタに実装される（外部からリクエストされるものであるため）
 */
export interface GetToCartQuery {
  cartId: number;
}
