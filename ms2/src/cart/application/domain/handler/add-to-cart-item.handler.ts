import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ThisError } from '../../../../error/this-error';
import { AddToCartItemUseCase } from '../../port/in/command/add-to-cart-item.usecase';
import { AddToCartItemCommand } from '../../port/in/command/add-to-cart-item.command';
import { AddToCartItemCommandRequest } from '../../../adapter/in/command/add-to-cart-item.command.request';
import { SaveCartPort } from '../../port/out/save-cart.port';

/**
 * 入力Port（AddToCartItemUseCase）を実装しているハンドラ
 */
@CommandHandler(AddToCartItemCommandRequest)
export class AddToCartItemHandler implements ICommandHandler<AddToCartItemCommand>, AddToCartItemUseCase {
  public constructor(
    @Inject('CartRepository') private readonly cartRepository: SaveCartPort
  ) {}

  async execute(cmd: AddToCartItemCommand): Promise<void | ThisError>{
    await this.cartRepository.saveCartItem({
      id: cmd.id,
      skuCode: cmd.skuCode,
      price: cmd.price,
      quantity: cmd.quantity,
      cartId: cmd.cartId,
    });
  }
}
