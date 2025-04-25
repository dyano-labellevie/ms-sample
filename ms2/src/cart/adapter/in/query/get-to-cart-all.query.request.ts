import { ValidationError } from '../../../../error/validation-error';
import { GetToCartAllQuery } from '../../../application/port/in/query/get-to-cart-all.query';

/**
 * 外部からリクエストするためのクエリ
 * 入力用インターフェースを実装する
 */
export class GetToCartAllQueryRequest implements GetToCartAllQuery {
  private constructor() {}

  /**
   * クエリを生成するための名前付きコンストラクタ
   * リクエストのため、バリデーションも行う
   *
   * @returns
   */
  public static createQuery(): [GetToCartAllQuery, null] | [null, ValidationError[]] {
    return [new GetToCartAllQueryRequest(), null];
  }
}
