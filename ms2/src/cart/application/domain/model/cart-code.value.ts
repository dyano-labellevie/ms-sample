import { ThisError } from '../../../../error/this-error';

/**
 * カートを一意に識別するためのコードを表す値オブジェクト
 */
export class CartCode {
  // コンストラクはprivateとし、名前付きコンストラクタを使用する
  private constructor(
    // 本クラス自体がルールづけられた値となるため、string型で問題ない
    public readonly value: string
  ) {}

  /**
   * カートコードを生成をするための名前付きコンストラクタ
   * Cart（集約）経由でのみ呼び出す
   *
   * @param value
   * @returns
   */
  public static init(value: string): [CartCode, null] | [null, ThisError] {
    // カートコードのルールを定義して、インスタンス化されたCartCodeオブジェクトが不正な状態になることを防ぐ
    if (value.length < 64) {
      // エラー時はエラーオブジェクトを含むTupleを返し、例外は投げない様にする
      // こうすることで、呼び出し時のエラーを制御しやすくなる
      return [
        null,
        ThisError.invalidArgumentError('CartCodeが64文字未満です。')
      ];
    }

    if (value.length > 64) {
      // エラー時はエラーオブジェクトを含むTupleを返し、例外は投げない様にする
      // こうすることで、呼び出し時のエラーを制御しやすくなる
      return [
        null,
        ThisError.invalidArgumentError('CartCodeが64文字を超過しています。')
      ];
    }

    // エラーがない場合は、CartCodeオブジェクトを含むTupleを返す
    return [new CartCode(value), null];
  }

  /**
   * 値オブジェクトの等価性を比較する
   */
  public equals(other: CartCode): boolean {
    // カートコードは一意であるため、値が同じであれば等価とする
    return this.value === other.value;
  }
}
