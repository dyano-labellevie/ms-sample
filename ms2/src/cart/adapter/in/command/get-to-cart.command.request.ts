import { ValidationError } from '../../../../error/validation-error';
import { GetToCartCommand } from '../../../application/port/in/get-to-cart.command';

/**
 * 外部からリクエストするためのコマンド
 * 入力用インターフェースを実装する
 */
export class GetToCartCommandRequest implements GetToCartCommand {
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
  public static createCommand(cartId: number): [GetToCartCommand, null] | [null, ValidationError[]] {
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
    return [new GetToCartCommandRequest(cartId), null];
  }
}
