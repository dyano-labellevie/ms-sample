import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ThisError } from '../../../../error/this-error';
import { AddToCartUseCase } from '../../port/in/command/add-to-cart.usecase';
import { AddToCartCommand } from '../../port/in/command/add-to-cart.command';
import { AddToCartCommandRequest } from '../../../adapter/in/command/add-to-cart.command.request';
import { SaveCartPort } from '../../port/out/save-cart.port';

/**
 * 入力Port（AddToCartUsecase）を実装しているハンドラ
 */
@CommandHandler(AddToCartCommandRequest)
export class AddToCartHandler implements ICommandHandler<AddToCartCommand>, AddToCartUseCase {
  public constructor(
    @Inject('CartRepository') private readonly cartRepository: SaveCartPort
  ) {}

  async execute(cmd: AddToCartCommand): Promise<void | ThisError>{
    await this.cartRepository.saveCart({
      id: cmd.id,
      userUuid: cmd.userUuid,
      cartCode: cmd.cartCode,
    });
  }
}
