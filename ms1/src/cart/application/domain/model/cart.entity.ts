import { ThisError } from '../../../../error/this-error';
import { User } from './user.value';
import { CartCode } from './cart-code.value';
import {CartItem } from './cart-item.value';
import crypto from 'crypto';
import { Sku } from './sku.value';

/**
 * カートを表すエンティティであり、集約ルート
 * カート内商品へのアクセスは、本集約を通してのみ行う
 */
export class Cart {
  private constructor(
    // 値オブジェクトを持つことで、カートの持つUserが不正ではないことを保証する
    private readonly user: User,
    // 値オブジェクトを持つことで、カートの持つカートコードが不正ではないことを保証する
    // 集約を一意に識別するためのフィールドがカートコードである
    private readonly cart_code: CartCode,
    // 値オブジェクトの配列を持つことで、カートの持つカート内商品が不正ではないことを保証する
    private readonly items: CartItem[],
  ) {}

  /**
   * カート（エンティティ、集約ルート）を生成する名前付きコンストラクタ
   * 初期（カートコードが存在しない場合）にはこちらを使う
   *
   * @param userUuid
   */
  public static init(userUuid: string): [Cart, null] | [null, ThisError] {
    // userUuidが不正な場合はエラー
    const [u, userError] = User.init(userUuid);
    if (userError) {
      // エラー時はエラーオブジェクトを含むTupleを返し、例外は投げない様にする
      // こうすることで、呼び出し時のエラーを制御しやすくなる
      return [null, userError];
    }

    // カートコードが生成できない場合はエラー
    const [cc, cartCodeError] = Cart.genCartCode(u);
    if (cartCodeError) {
      // エラー時はエラーオブジェクトを含むTupleを返し、例外は投げない様にする
      // こうすることで、呼び出し時のエラーを制御しやすくなる
      return [null, cartCodeError];
    }

    // エラーがない場合は、Cartエンティティを含むTupleを返す
    return [new Cart(u, cc, []), null];
  }

  /**
   * カート（エンティティ、集約ルート）を生成する名前付きコンストラクタ
   * カートコードが存在する場合にはこちらを使う
   *
   * @param userUuid
   * @param cartCode
   * @param items
   * @returns
   */
  public static setup(
    userUuid: string,
    cartCode: string,
    // ドメインモデルであるエンティティはDBなど外部接続が発生するものをクラス内部で持たない
    // そのため、カート内商品は外部から渡される
    items: CartItem[]
  ): [Cart, null] | [null, ThisError] {
    // userUuidが不正な場合はエラー
    const [u, userError] = User.init(userUuid);
    if (userError) {
      // エラー時はエラーオブジェクトを含むTupleを返し、例外は投げない様にする
      // こうすることで、呼び出し時のエラーを制御しやすくなる
      return [null, userError];
    }

    // カートコードを復元（initというメソッド名になっているが、初期化というよりは復元の方が相応しい気もする）
    // 相応しいと思える名前が見つかった場合は、リファクタリングを行うこと
    const [cc, cartCodeError] = CartCode.init(cartCode);
    if (cartCodeError) {
      // エラー時はエラーオブジェクトを含むTupleを返し、例外は投げない様にする
      // こうすることで、呼び出し時のエラーを制御しやすくなる
      return [null, cartCodeError];
    }

    // ユーザー情報からカートコードを生成する
    const [check, checkCartCodeError] = Cart.genCartCode(u);
    if (checkCartCodeError) {
      // エラー時はエラーオブジェクトを含むTupleを返し、例外は投げない様にする
      // こうすることで、呼び出し時のエラーを制御しやすくなる
      return [null, checkCartCodeError];
    }
    // ユーザー情報から生成したカートコードと、外部から渡されたカートコードが一致しない場合はエラー
    // 値オブジェクトの比較となるため、等価性チェック用のメソッドを使用する
    if (!cc.equals(check)) {
      // エラー時はエラーオブジェクトを含むTupleを返し、例外は投げない様にする
      // こうすることで、呼び出し時のエラーを制御しやすくなる
      return [
        null,
        // エラーはエラー専用メソッドを使用して生成する
        // こうすることで、どんなエラーが発生したのかを明示的にする
        noMatchCartCodeError(u.userUuid, cc.value)
      ];
    }

    // エラーがない場合は、Cartエンティティを含むTupleを返す
    // カート内商品も設定してカートエンティティを生成する
    //
    return [new Cart(u, cc, items), null];
  }

  /**
   * カートコードを生成する
   * カートコード生成を外部からは任意で行わせる意味がないため、privateメソッドとして定義する
   *
   * @param user
   */
  private static genCartCode(user: User): [CartCode, null] | [null, ThisError] {
    // カートコード自体がこの処理を持ってもよかったかもしれない
    // 要検討
    const hash = crypto.createHash('sha256')
      .update(user.userUuid)
      .digest('hex');

    return CartCode.init(hash);
  }

  /**
   * カート内商品が空かどうかを判定する
   *
   * @returns
   */
  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  /**
   * このカートの所有者であるユーザーのUUIDを取得する
   * userに対して外部から直接操作を行わせない（カートのコンテキスト上から外れてしまうことを防ぐ）ため、getterを用意する
   */
  public get userUuid(): string {
    return this.user.userUuid;
  }

  /**
   * このカートのカートコードを取得する
   * cartCodeに対して外部から直接操作を行わせないため、getterを用意する
   */
  public get cartCode(): string {
    return this.cart_code.value;
  }

  /**
   * カート内商品を取得する
   * CartItemを操作させたくないため、参照用オブジェクトの配列を返す
   * 参照用のオブジェクトのため、型はこの場で定義する
   *
   * @returns
   */
  public get cartItems(): { skuCode: string, price: number, quantity: number }[] {
    return this.items.map(item => {
      return {
        skuCode: item.skuCode,
        price: item.price,
        quantity: item.quantity
      };
    });
  };

  /**
   * カートに商品を追加する
   * addItemとしているが、取り置きをしたとも言える
   * つまり、カート内商品とは取り置き商品であるとも言える
   * 業務で使われる用語に合わせる
   *
   * @param sku
   * @param quantity
   * @returns
   */
  public addItem(sku: Sku, quantity: number): void | ThisError {
    // skuをカート内商品に変換
    const [newItem, error] = CartItem.init(sku, quantity);
    if (error) {
      // コマンド処理はエラーが発生したらエラーを、そうでなければ何も返さない。
      return error;
    }

    // 既に同じ商品がカートに入っているかを確認し、存在していれば数量を増やす必要がある
    // カート内商品の等価性確認を行い、同じ商品があるかを確認する
    const index = this.items.findIndex(item => item.equals(newItem));
    // 見つからない場合は新規追加
    if (index === -1) {
      this.items.push(newItem);
    } else {
      // 見つかった場合は、新しいカート内商品を生成し入れ替える
      // カート内商品は値オブジェクトであるため、新しいインスタンスを生成する
      const [newItem, error] = CartItem.init(
        sku, this.items[index].quantity + quantity
      );
      if (error) {
        // コマンド処理はエラーが発生したらエラーを、そうでなければ何も返さない。
        return error;
      }

      // 入れ替える
      this.items[index] = newItem;
    }
  }
}

/**
 * カートコードが一致しないエラーを生成する
 * 外部から呼び出すことはないためexportをせず、クラスにも含めない
 * 厳密な型判定は必要ないため、リテラル値そのものを使用している
 *
 * @param uuid
 * @param cartCode
 * @returns
 */
function noMatchCartCodeError(uuid: string, cartCode: string): ThisError {
  return new ThisError(
    'NoMatchCartCodeError',
    `ユーザーUUIDとカートコードが一致しません。${uuid} !== ${cartCode}`
  );
}
