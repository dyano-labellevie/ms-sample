import { ThisError } from '../../../../error/this-error';
import { CartCode } from './cart-code.value';

describe('CartCode（値オブジェクト）', () => {
  describe('.init', () => {
    const sut = CartCode;

    test('cart-codeは64文字', () => {
      const value = 'abcde123'.repeat(8);
      expect(value.length).toBe(64);

      const [cartCode, error] = sut.init(value);

      expect(cartCode).toBeInstanceOf(CartCode);
      expect(error).toBeNull();
    });

    test('cart-codeが64文字未満の場合、エラーが返る', async () => {
      const value = 'abcde123'.repeat(8).substring(0, 63);
      expect(value.length).toBe(63);

      const [cartCode, error] = sut.init(value);

      expect(cartCode).toBeNull();
      expect(error).toBeInstanceOf(ThisError);
    });

    test('cart-codeが65文字以上の場合、エラーが返る', async () => {
      const value = 'abcde123'.repeat(8) + 'a';
      expect(value.length).toBe(65);

      const [cartCode, error] = sut.init(value);

      expect(cartCode).toBeNull();
      expect(error).toBeInstanceOf(ThisError);
    });
  });

  describe('#equals', () => {
    test('cart-codeが一致する', () => {
      const value1 = 'abcde123'.repeat(8);
      const value2 = 'abcde123'.repeat(8);
      const [sut, _] = CartCode.init(value1) as [CartCode, null];
      const [other, __] = CartCode.init(value2) as [CartCode, null];

      expect(sut.equals(other)).toBe(true);
    });

    test('cart-codeが一致しない', () => {
      const value1 = 'abcde123'.repeat(8);
      const value2 = 'fghij456'.repeat(8);
      const [sut, _] = CartCode.init(value1) as [CartCode, null];
      const [other, __] = CartCode.init(value2) as [CartCode, null];

      expect(sut.equals(other)).toBe(false);
    });
  });
});
