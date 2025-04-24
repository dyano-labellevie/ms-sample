import { Inject, Injectable } from '@nestjs/common';
import { ThisError } from '../../../../error/this-error';
import { DeleteToCartUseCase } from '../../port/in/delete-to-cart.usecase';
import { DeleteToCartCommand } from '../../port/in/delete-to-cart.command';
import { DeleteCartPort } from '../../port/out/delete-cart.port';

/**
 * 入力Port（DeleteToCartUsecase）を実装しているサービス
 */
@Injectable()
export class DeleteToCartService implements DeleteToCartUseCase {
  // Interfaceを利用してDIしているので、下記の様な記述が必要となる
  public constructor(
    @Inject('CartRepository') private readonly cartRepository: DeleteCartPort
  ) {}

  /**
   * Cartを削除する
   * @param cmd
   * @returns
   */
  public async deleteItem(cmd: DeleteToCartCommand): Promise<void | ThisError> {
    // Cartを削除する
    await this.cartRepository.delete({
      cartId: cmd.cartId,
    });
  }
}
