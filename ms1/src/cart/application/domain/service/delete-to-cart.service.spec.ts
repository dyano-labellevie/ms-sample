import { Test, TestingModule } from '@nestjs/testing';
import { DeleteToCartService } from './delete-to-cart.service';
import { DeleteToCartCommand } from '../../port/in/delete-to-cart.command';
import { DeleteCartPort } from '../../port/out/delete-cart.port';
import { ThisError } from '../../../../error/this-error';

class CartRepositoryMock implements DeleteCartPort {
  async delete(cart: {
    cartId: number;
  }): Promise<void | ThisError> {
    return;
  }
}

describe('DeleteToCartService（ドメインサービス）', () => {
  describe('#deleteItem', () => {
    let sut: DeleteToCartService;
    let cr: DeleteCartPort;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          DeleteToCartService,
          {
            provide: 'CartRepository',
            useClass: CartRepositoryMock
          }
        ],
      }).compile();

      sut = module.get<DeleteToCartService>(DeleteToCartService);
      cr = module.get<DeleteCartPort>('CartRepository');
    });

    test('カートを削除できた', async () => {
      const cmd: DeleteToCartCommand = {
        cartId: 1,
      };
      const crSpy = jest.spyOn(cr, 'delete');

      const error = await sut.deleteItem(cmd);

      expect(error).toBeUndefined();
      expect(crSpy).toHaveBeenCalledTimes(1);
    });
  });
});
