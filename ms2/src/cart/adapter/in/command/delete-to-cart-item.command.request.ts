import { ValidationError } from '../../../../error/validation-error';
import { DeleteToCartItemCommand } from '../../../application/port/in/command/delete-to-cart-item.command';

/**
 * 外部からリクエストするためのコマンド
 * 入力用インターフェースを実装する
 */
export class DeleteToCartItemCommandRequest implements DeleteToCartItemCommand {
  private constructor(
    public readonly cartId: number
) {}

  /**
   * コマンドを生成するための名前付きコンストラクタ
   * リクエストのため、バリデーションも行う
   *
   * @param cartId
   * @returns
   */
  public static createCommand(
    cartId: number
  ): [DeleteToCartItemCommand, null] | [null, ValidationError[]] {
    const errors: ValidationError[] = [];

    // バリデーション
    // バリデーションエラーは全て返す様にする
    // このエラーはログに残すことは考えていないが、呼び出し側が表示する可能性がある。
    // @TODO: バリデーションエラーに持たせるべき情報を考える
    if (!cartId) {
      errors.push(new ValidationError('cartId', 'cartId is required'));
    }

    // バリデーションに1件でも引っかかればエラーとする
    if (errors.length > 0) {
      return [null, errors];
    }

    // エラーがない場合は、コマンドを含むTupleを返す
    return [new DeleteToCartItemCommandRequest(cartId), null];
  }
}
