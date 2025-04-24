import { Inject, Injectable } from '@nestjs/common';
import { ThisError } from '../../../../error/this-error';
import { AddToCartUseCase } from '../../port/in/add-to-cart.usecase';
import { AddToCartCommand } from '../../port/in/add-to-cart.command';
import { Cart } from '../model/cart.entity';
import { Sku } from '../model/sku.value';
import { TemporarilyAllocateStockPort } from '../../port/out/temporarily-allocate-stock.port';
import { SaveCartPort } from '../../port/out/save-cart.port';

/**
 * 入力Port（AddToCartUsecase）を実装しているサービス
 */
@Injectable()
export class AddToCartService implements AddToCartUseCase {
  // Interfaceを利用してDIしているので、下記の様な記述が必要となる
  public constructor(
    @Inject('StockService') private readonly stockService: TemporarilyAllocateStockPort,
    @Inject('CartRepository') private readonly cartRepository: SaveCartPort,
  ) {}

  /**
   * Cartに商品を追加する
   * コマンドに多態性を持たせる方がコードの拡張性が高まるが、現在はそうなっていない
   * コマンドメソッドなので、成功した時は何も返さず、エラー時にはエラーオブジェクトを返す
   * @param cmd
   * @returns
   */
  public async addItem(cmd: AddToCartCommand): Promise<void | ThisError> {
    // Cartを生成（@TODO 現在カートに入っている商品も取得する。その際、後の整合性のためにバージョンも取得しておく）
    const items = [];
    // ここがカートの復元なのは、本メソッドを呼び出す段階ではカートの初期化が終わっていることをコードが保証しているため
    // AddToCartCommandがcartCodeが空であることを許さない
    const [cart, cartSetupError] = Cart.setup(cmd.userUuid, cmd.cartCode, items);
    // カートの復元に失敗した場合はエラーを返す
    if (cartSetupError) {
      return cartSetupError;
    }

    // カートに入れるための商品を生成
    const [sku, skuInitError] = Sku.init(cmd.sku.skuCode, cmd.sku.price);
    // 商品の生成に失敗した場合はエラーを返す
    if (skuInitError) {
      return skuInitError;
    }

    // Cartに商品を追加
    // @TODO 在庫引当
    // TODO 本実装をした場合、エラーオブジェクトが返ってくる可能性がある 現段階では仮実装なので呼び出しっぱなしのままにする
    await this.stockService.tempAllocateStock(sku.skuCode, sku.price, cmd.quantity);
    // Cart（集約）に対して、商品を追加する
    // この時点ではまだDBに保存しない（保存するのは集約全体）
    const cartAddItemError = cart.addItem(sku, cmd.quantity);
    if (cartAddItemError) {
      // @TODO 失敗したら在庫引当を戻す
      // 集約に対しての操作が失敗した場合はエラーを返す
      return cartAddItemError;
    }

    // Cart全体を保存する
    // @TODO この時バージョンも確認する方が良いので、渡す様にする
    //       バージョンを確認することで、別途APIを呼び出されていた場合にカートが前の状態に戻ってしまうということを避けられる
    // @TODO 失敗したら在庫引当を戻す
    await this.cartRepository.save({
      userUuid: cart.userUuid,
      cartCode: cart.cartCode,
      items: [...cart.cartItems],
    });
  }
}
