import { ValidationError } from '../../../../error/validation-error';
import { AddToCartItemCommand } from '../../../application/port/in/command/add-to-cart-item.command';

/**
 * 外部からリクエストするためのコマンド
 * 入力用インターフェースを実装する
 */
export class AddToCartItemCommandRequest implements AddToCartItemCommand {
  private constructor(
    public readonly id: number,
    public readonly skuCode: string,
    public readonly price: number,
    public readonly quantity: number,
    public readonly cartId: number
) {}

  /**
   * コマンドを生成するための名前付きコンストラクタ
   * リクエストのため、バリデーションも行う
   *
   * @param id
   * @param skuCode
   * @param price
   * @param quantity
   * @param cartId
   * @returns
   */
  public static createCommand(
    id: number,
    skuCode: string,
    price: number,
    quantity: number,
    cartId: number,
  ): [AddToCartItemCommand, null] | [null, ValidationError[]] {
    const errors: ValidationError[] = [];

    // バリデーション
    // バリデーションエラーは全て返す様にする
    // このエラーはログに残すことは考えていないが、呼び出し側が表示する可能性がある。
    // @TODO: バリデーションエラーに持たせるべき情報を考える
    if (!id) {
      errors.push(new ValidationError('id', 'id is required'));
    }
    if (!skuCode) {
      errors.push(new ValidationError('skuCode', 'skuCode is required'));
    }
    if (!price) {
      errors.push(new ValidationError('price', 'price is required'));
    }
    if (!cartId) {
      errors.push(new ValidationError('cartId', 'cartId is required'));
    }
    if (!quantity) {
      errors.push(new ValidationError('quantity', 'quantity is required'));
    }
    else if (quantity <= 0) {
      errors.push(new ValidationError('quantity', 'quantity must be greater than 0'));
    }
    if (!cartId) {
      errors.push(new ValidationError('cartId', 'cartId is required'));
    }

    // バリデーションに1件でも引っかかればエラーとする
    if (errors.length > 0) {
      return [null, errors];
    }

    // エラーがない場合は、コマンドを含むTupleを返す
    return [new AddToCartItemCommandRequest(id, skuCode, price, quantity, cartId), null];
  }
}
