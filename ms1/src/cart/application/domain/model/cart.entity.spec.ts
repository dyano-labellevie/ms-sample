import { ThisError } from '../../../../error/this-error';
import { Cart } from './cart.entity';
import { Sku } from './sku.value';
import { CartItem } from './cart-item.value';

describe('Cart（エンティティ、集約）', () => {
  describe('.init', () => {
    const sut = Cart;

    test('カートの生成', () => {
      const userUuid = 'user_uuid';

      const [cart, error] = sut.init(userUuid);

      expect(cart).toBeInstanceOf(Cart);
      expect(error).toBeNull();
    });

    test('uuidが不正の場合はエラー', () => {
      const userUuid = '';

      const [cart, error] = sut.init(userUuid);

      expect(cart).toBeNull();
      expect(error).toBeInstanceOf(ThisError);
    });
  });

  describe('.setup', () => {
    const sut = Cart;

    test('カートの生成', () => {
      const userUuid = 'user_uuid';
      const cartCode = '69e0680aaf63792ed09be1dd0700490417b8e8cb687d0366149f7472b8e0d092';
      const cartItems = [];

      const [cart, error] = sut.setup(userUuid, cartCode, cartItems);

      expect(cart).toBeInstanceOf(Cart);
      expect(error).toBeNull();
    });

    test('ユーザーのカートじゃないと判断された場合はエラー', () => {
      const userUuid = 'user_uuid';
      const othersCartCode = 'other123456789other123456789other123456789other123456789other123';
      const cartItems = [];

      const [cart, error] = sut.setup(userUuid, othersCartCode, cartItems);

      expect(cart).toBeNull();
      expect(error).toBeInstanceOf(ThisError);
    });
  });

  describe('#isEmpty', () => {
    test('カートが空', () => {
      const userUuid = 'user_uuid';
      const [sut, _] = Cart.init(userUuid) as [Cart, null];

      expect(sut.isEmpty()).toBe(true);
    });

    test('カートに商品が入っている', () => {
      const userUuid = 'user_uuid';
      const cartCode = '69e0680aaf63792ed09be1dd0700490417b8e8cb687d0366149f7472b8e0d092';
      const [sku, _] = Sku.init('sku1', 1000) as [Sku, null];
      const [cartItem, __] = CartItem.init(sku, 1) as [CartItem, null];
      const [sut, ___] = Cart.setup(userUuid, cartCode, [cartItem]) as [Cart, null];

      expect(sut.isEmpty()).toBe(false);
    });
  });

  describe('#cartItems', () => {
    test('カートが空', () => {
      const userUuid = 'user_uuid';
      const [sut, _] = Cart.init(userUuid) as [Cart, null];

      const items = sut.cartItems;

      expect(items).toStrictEqual([]);
    });

    test('カートに商品が入っている', () => {
      const userUuid = 'user_uuid';
      const cartCode = '69e0680aaf63792ed09be1dd0700490417b8e8cb687d0366149f7472b8e0d092';
      const [sku, _] = Sku.init('sku1', 1000) as [Sku, null];
      const [cartItem, __] = CartItem.init(sku, 1) as [CartItem, null];
      const [sut, ___] = Cart.setup(userUuid, cartCode, [cartItem]) as [Cart, null];

      const items = sut.cartItems;

      expect(items).toStrictEqual([{
        skuCode: 'sku1',
        price: 1000,
        quantity: 1
      }]);
    });
  });

  describe('#addToCart', () => {
    let sut: Cart;

    beforeEach(() => {
      const userUuid = 'user_uuid';
      const [cart, _] = Cart.init(userUuid) as [Cart, null];

      sut = cart;
      // 念の為チェックを入れておく
      expect(sut.isEmpty()).toBe(true);
    });

    test('カートに商品が追加され、イベントも残る', () => {
      const [sku, _] = Sku.init('sku1', 1000) as [Sku, null];

      const error = sut.addItem(sku, 1);

      // 成功時は戻り値がない
      expect(error).toBeUndefined();
      expect(sut.cartItems).toStrictEqual([{
        skuCode: 'sku1',
        price: 1000,
        quantity: 1
      }]);
    });

    test('同一商品が追加された場合、数量（quantity）が増える（イベントはaddItemの回数分残る）', () => {
      const [sku, _] = Sku.init('sku1', 1000) as [Sku, null];
      for (let i = 1; i <= 2; i++) {
        sut.addItem(sku, 1);
      }

      const items = sut.cartItems;
      expect(items).toStrictEqual([{
        skuCode: 'sku1',
        price: 1000,
        quantity: 2
      }]);
    });

    test('数量を0以下で追加しようとしたらエラー', () => {
      const [sku, _] = Sku.init('sku1', 1000) as [Sku, null];

      const error = sut.addItem(sku, 0);

      expect(error).toBeInstanceOf(ThisError);
      expect(sut.isEmpty()).toBe(true);
    });
  });
});
