import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ThisError } from '../../../../error/this-error';
import { DeleteToCartUseCase } from '../../port/in/command/delete-to-cart.usecase';
import { DeleteToCartCommand } from '../../port/in/command/delete-to-cart.command';
import { DeleteToCartCommandRequest } from 'src/cart/adapter/in/command/delete-to-cart.command.request';
import { DeleteCartPort } from '../../port/out/delete-cart.port';

/**
 * 入力Port（DeleteToCartUsecase）を実装しているハンドラ
 */
@CommandHandler(DeleteToCartCommandRequest)
export class DeleteToCartHandler implements ICommandHandler<DeleteToCartCommand>, DeleteToCartUseCase {
  public constructor(
    @Inject('CartRepository') private readonly cartRepository: DeleteCartPort
  ) {}

  async execute(cmd: DeleteToCartCommand): Promise<void | ThisError>{
    await this.cartRepository.deleteCart({
      cartId: cmd.cartId,
    });
  }
}
