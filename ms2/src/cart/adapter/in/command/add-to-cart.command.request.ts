import { ValidationError } from '../../../../error/validation-error';
import { AddToCartCommand } from '../../../application/port/in/command/add-to-cart.command';

/**
 * 外部からリクエストするためのコマンド
 * 入力用インターフェースを実装する
 */
export class AddToCartCommandRequest implements AddToCartCommand {
  private constructor(
    public readonly id: number,
    public readonly userUuid: string,
    public readonly cartCode: string
) {}

  /**
   * コマンドを生成するための名前付きコンストラクタ
   * リクエストのため、バリデーションも行う
   *
   * @param id
   * @param userUuid
   * @param cartCode
   * @returns
   */
  public static createCommand(
    id: number,
    userUuid: string,
    cartCode: string
  ): [AddToCartCommand, null] | [null, ValidationError[]] {
    const errors: ValidationError[] = [];

    // バリデーション
    // バリデーションエラーは全て返す様にする
    // このエラーはログに残すことは考えていないが、呼び出し側が表示する可能性がある。
    // @TODO: バリデーションエラーに持たせるべき情報を考える
    if (!id) {
      errors.push(new ValidationError('id', 'id is required'));
    }
    if (!userUuid) {
      errors.push(new ValidationError('userUuid', 'userUuid is required'));
    }
    if (!cartCode) {
      errors.push(new ValidationError('cartCode', 'cartCode is required'));
    }

    // バリデーションに1件でも引っかかればエラーとする
    if (errors.length > 0) {
      return [null, errors];
    }

    // エラーがない場合は、コマンドを含むTupleを返す
    return [new AddToCartCommandRequest(id, userUuid, cartCode), null];
  }
}
