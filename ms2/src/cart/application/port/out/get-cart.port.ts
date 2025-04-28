import { Cart } from '../../domain/model/cart.entity';
import { ThisError } from '../../../../error/this-error';

/**
 * 出力用ポート
 * アダプタが実装する
 */
export interface GetCartPort {
  findAll(): Promise<Cart[] | ThisError>;
  findOne(id: number): Promise<Cart | ThisError>;
}
