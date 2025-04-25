import { ThisError } from '../../../../../error/this-error';
import { GetToCartAllQuery } from './get-to-cart-all.query';

/**
 * 入力用ポート
 * カートを取得するというユースケースを表す
 * このインターフェイスを実装するのはドメイン層であり、アダプタ層は本インターフェイスを利用してユースケースを実行する
 */
export interface GetToCartAllUseCase {
  execute(query: GetToCartAllQuery): Promise<any[] | ThisError>;
}
