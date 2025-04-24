import { ThisError } from '../../../../error/this-error';

/**
 * 出力用ポート
 * アダプタが実装する
 */
export interface DeleteCartPort {
  deleteCartItem(cartItem: {
    cartId: number;
  }): Promise<void | ThisError>;

  deleteCart(cart: {
    cartId: number;
  }): Promise<void | ThisError>;
}
