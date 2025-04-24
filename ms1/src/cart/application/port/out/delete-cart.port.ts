import { ThisError } from '../../../../error/this-error';

/**
 * 出力用ポート
 * アダプタが実装する
 */
export interface DeleteCartPort {
  delete(cart: {
    cartId: number;
  }): Promise<void | ThisError>;
}
