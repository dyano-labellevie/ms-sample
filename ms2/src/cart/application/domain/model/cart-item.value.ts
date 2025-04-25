import { ThisError } from '../../../../error/this-error';
import { Sku } from './sku.value';

/**
 * カート内商品を表す値オブジェクト
 */
export class CartItem {
  private constructor(
    // 値オブジェクトを持つことで、カート内商品の持つSkuが不正ではないことを保証する
    private readonly sku: Sku,
    private readonly qty: number
  ) {}

  /**
   * カート内商品を生成するための名前付きコンストラクタ
   *
   * @param sku
   * @param quantity
   * @returns
   */
  public static init(sku: Sku, quantity: number): [CartItem, null] | [null, ThisError] {
    // 型では防ぎきれない、quantityに0以下の値を渡された場合を考慮しておく
    // 他にもカート内商品を表現する上でのルールがあれば、それに合わせてバリデーションを追加していく
    if (quantity < 1) {
      // エラー時はエラーオブジェクトを含むTupleを返し、例外は投げない様にする
      // こうすることで、呼び出し時のエラーを制御しやすくなる
      return [
        null,
        // 渡されてはいけない引数が渡された場合は、引数エラーであることを明示的にする
        ThisError.invalidArgumentError('CartItemのquantityは1以上である必要があります')
      ];
    }

    // エラーがない場合は、CartItemオブジェクトを含むTupleを返す
    return [new CartItem(sku, quantity), null];
  }

  /**
   * 値オブジェクトの等価性を比較する
   *
   * @param other
   * @returns
   */
  public equals(other: CartItem): boolean {
    // 商品（sku）が同じであれば等価とする
    return this.sku.equals(other.sku);
  }

  /**
   * カート内商品のskuCodeを取得する
   * skuに対して外部から直接操作を行わせないため、getterを用意する
   */
  public get skuCode(): string {
    return this.sku.skuCode;
  }

  /**
   * カート内商品の価格を取得する
   * skuに対して外部から直接操作を行わせないため、getterを用意する
   */
  public get price(): number {
    return this.sku.price;
  }

  /**
   * カート内商品の数量を取得する
   */
  public get quantity(): number {
    return this.qty;
  }
}
