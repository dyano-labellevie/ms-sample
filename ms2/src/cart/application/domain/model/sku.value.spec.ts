import { ThisError } from '../../../../error/this-error';
import { Sku } from './sku.value';

describe('Sku（値オブジェクト）', () => {
  describe('.init', () => {
    const sut = Sku;

    test('skuが生成される', () => {
      const [sku, error] = sut.init('skucode', 1000);

      expect(sku).toBeInstanceOf(Sku);
      expect(error).toBeNull();
    });

    test('sku_codeが空文字の場合、エラーが返る', async () => {
      const [sku, error] = sut.init('', 1000);

      expect(sku).toBeNull();
      expect(error).toBeInstanceOf(ThisError);
    });

    test('priceが0未満の場合、エラーが返る', () => {
      const [sku, error] = sut.init('skucode', -1);

      expect(sku).toBeNull();
      expect(error).toBeInstanceOf(ThisError);
    });
  });

  describe('#equals', () => {
    test('sku_codeが同じ場合、trueが返る', () => {
      const [sut, _] = Sku.init('sku_code', 1000) as [Sku, null];
      const [other, __]= Sku.init('sku_code', 1000) as [Sku, null];

      expect(sut.equals(other)).toBe(true);
    });

    test('sku_codeが異なる場合、falseが返る', () => {
      const [sut, _] = Sku.init('sku_code_1', 1000) as [Sku, null];
      const [other, __]= Sku.init('sku_code_2', 1000) as [Sku, null];

      expect(sut.equals(other)).toBe(false);
    });
  });
});
