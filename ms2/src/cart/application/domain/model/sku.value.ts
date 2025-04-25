import { ThisError } from '../../../../error/this-error';

/**
 * カートというコンテキストにて考えた際の、商品を表す値オブジェクト
 */
export class Sku {
  private constructor(
    // 本コンテキストにおいてskuCodeの厳密性は問わないため、string型で問題ない
    // 名前付きコンストラクタにて、弾くべき値は弾く
    public readonly skuCode: string,
    public readonly price: number
  ) {}

  /**
   * Sku(カートに入れる前の商品)を生成をするための名前付きコンストラクタ
   *
   * @param skuCode
   * @param price
   * @returns
   */
  public static init(skuCode: string, price: number): [Sku, null] | [null, ThisError] {
    // 型では防ぎきれない、skuCodeに空文字を渡された場合を考慮しておく
    // こうしておくことで、インスタンス化されたSkuオブジェクトが不正な状態になることを防ぐ
    // 他にもルールがあれば、それに合わせてバリデーションを追加していく
    if (skuCode === '') {
      // エラー時はエラーオブジェクトを含むTupleを返し、例外は投げない様にする
      // こうすることで、呼び出し時のエラーを制御しやすくなる
      return [
        null,
        // 渡されてはいけない引数が渡された場合は、引数エラーであることを明示的にする
        ThisError.invalidArgumentError('skuのskuCodeに空文字が渡されています。')
      ];
    // 型では防ぎきれない、priceがマイナス値を渡された場合を考慮しておく
    // こうしておくことで、インスタンス化されたSkuオブジェクトが不正な状態になることを防ぐ
    // 他にもルールがあれば、それに合わせてバリデーションを追加していく
    } else if (price < 0) {
      return [
        null,
        // 渡されてはいけない引数が渡された場合は、引数エラーであることを明示的にする
        ThisError.invalidArgumentError('skuのpriceは0以上である必要があります。')
      ];
    }

    // エラーがない場合は、Skuオブジェクトを含むTupleを返す
    return [new Sku(skuCode, price), null];
  }

  /**
   * 値オブジェクトの等価性を比較する
   *
   * @param other
   * @returns
   */
  public equals(other: Sku): boolean {
    // 現状はskuCodeが同じであれば等価とする
    // skuは同じでもpriceが異なるケースがあるかもしれないなど、ビジネスルールを反映する
    return this.skuCode === other.skuCode;
  }
}
