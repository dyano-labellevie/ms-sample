import { ThisError } from '../../../../../error/this-error';
import { DeleteToCartItemCommand } from './delete-to-cart-item.command';

/**
 * 入力用ポート
 * カートを削除するというユースケースを表す
 * このインターフェイスを実装するのはドメイン層であり、アダプタ層は本インターフェイスを利用してユースケースを実行する
 */
export interface DeleteToCartItemUseCase {
  execute(cmd: DeleteToCartItemCommand): Promise<void | ThisError>;
}
