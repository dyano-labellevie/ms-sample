import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ThisError } from '../../../../error/this-error';
import { DeleteToCartItemUseCase } from '../../port/in/command/delete-to-cart-item.usecase';
import { DeleteToCartItemCommand } from '../../port/in/command/delete-to-cart-item.command';
import { DeleteToCartItemCommandRequest } from 'src/cart/adapter/in/command/delete-to-cart-item.command.request';
import { DeleteCartPort } from '../../port/out/delete-cart.port';

/**
 * 入力Port（DeleteToCartItemUseCase）を実装しているハンドラ
 */
@CommandHandler(DeleteToCartItemCommandRequest)
export class DeleteToCartItemHandler implements ICommandHandler<DeleteToCartItemCommand>, DeleteToCartItemUseCase {
  public constructor(
    @Inject('CartRepository') private readonly cartRepository: DeleteCartPort
  ) {}

  async execute(cmd: DeleteToCartItemCommand): Promise<void | ThisError>{
    await this.cartRepository.deleteCartItem({
      cartId: cmd.cartId,
    });
  }
}
