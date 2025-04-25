import { ThisError } from "../../../../error/this-error";
import { CartItem } from "./cart-item.value";
import { Sku } from "./sku.value";

describe('CartItem（値オブジェクト）', () => {
  describe('.init', () => {
    const sut = CartItem;

    test('CartItemが生成される', async () => {
      const [sku, _] = Sku.init('sku', 1000) as [Sku, null];
      const [cart_item, error] = sut.init(sku, 1);
      expect(cart_item).toBeInstanceOf(CartItem);
      expect(error).toBeNull();
    });

    test('quantityが1未満の場合、エラーが返る', async () => {
      const [sku, _] = Sku.init('sku', 1000) as [Sku, null];
      const [cart_item, error] = sut.init(sku, 0);
      expect(cart_item).toBeNull();
      expect(error).toBeInstanceOf(ThisError);
    });
  });

  describe('#equals', () => {
    test('同じSKUの場合、trueが返る', async () => {
      const [sku, _] = Sku.init('sku', 1000) as [Sku, null];
      const [sut, __] = CartItem.init(sku, 1) as [CartItem, null];
      const [other, ___] = CartItem.init(sku, 1) as [CartItem, null];
      expect(sut.equals(other)).toBe(true);
    });

    test('異なるSKUの場合、falseが返る', async () => {
      const [sku1, _] = Sku.init('sku1', 1000) as [Sku, null];
      const [sku2, __] = Sku.init('sku2', 1000) as [Sku, null];
      const [sut, ___] = CartItem.init(sku1, 1) as [CartItem, null];
      const [other, ____] = CartItem.init(sku2, 1) as [CartItem, null];
      expect(sut.equals(other)).toBe(false);
    });
  });
});
