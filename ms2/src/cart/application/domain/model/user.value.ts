import { ThisError } from '../../../../error/this-error';

/**
 * カートというコンテキストにて考えた際の、ユーザーを表す値オブジェクト
 * 本コンテキストにおいてユーザーを状態があるデータとして管理する必要がないため、値オブジェクトとして扱う
 */
export class User {
  // コンストラクはprivateとし、名前付きコンストラクタを使用する
  private constructor(
    // userUuid自体を値オブジェクトとする場合もある
    public readonly userUuid: string
  ) {}

  /**
   * ユーザーを生成するための名前付きコンストラクタ
   *
   * @param userUuid
   * @returns
   */
  public static init(userUuid: string): [User, null] | [null, ThisError] {
    // 型では防ぎきれない、userUuidに空文字を渡された場合を考慮しておく
    // こうしておくことで、インスタンス化されたUserオブジェクトが不正な状態になることを防ぐ
    // 他にも観点があれば、それに合わせてバリデーションを追加していく
    if (userUuid === '') {
      // エラー時はエラーオブジェクトを含むTupleを返し、例外は投げない様にする
      // こうすることで、呼び出し時のエラーを制御しやすくなる
      return [
        null,
        // 渡されてはいけない引数が渡された場合は、引数エラーであることを明示的にする
        ThisError.invalidArgumentError('UserのuserUuidが空文字です。')
      ];
    }

    // エラーがない場合は、Userオブジェクトを含むTupleを返す
    return [new User(userUuid), null];
  }
}
