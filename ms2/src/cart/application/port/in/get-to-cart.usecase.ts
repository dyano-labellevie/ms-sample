import { ThisError } from '../../../../error/this-error';
import { GetToCartQuery } from './get-to-cart.query';

/**
 * 入力用ポート
 * カートを取得するというユースケースを表す
 * このインターフェイスを実装するのはドメイン層であり、アダプタ層は本インターフェイスを利用してユースケースを実行する
 */
export interface GetToCartUseCase {
  getItems(): Promise<void | ThisError>;
  getItem(query: GetToCartQuery): Promise<void | ThisError>;
}
