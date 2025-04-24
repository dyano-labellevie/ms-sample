import { ThisError } from '../../../../error/this-error';

/**
 * 出力用ポート
 * アダプタが実装する
 */
export interface SaveCartPort {
  save(cart: {
    userUuid: string;
    cartCode: string;
    items: { skuCode: string; price: number; quantity: number }[];
  }): Promise<void | ThisError>;

  saveCartItem(cartItem: {
    id: number;
    skuCode: string;
    price: number;
    quantity: number;
    cartId: number;
  }): Promise<void | ThisError>;

  saveCart(cart: {
    id: number;
    userUuid: string;
    cartCode: string;
  }): Promise<void | ThisError>;
}
