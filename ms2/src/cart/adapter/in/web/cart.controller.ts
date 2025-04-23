import { Controller, Get, Param, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetToCartCommandRequest } from '../command/get-to-cart.command.request';
import { AddToCartItemCommandRequest } from '../command/add-to-cart-item.command.request';
import { AddToCartCommandRequest } from '../command/add-to-cart.command.request';
import { DeleteToCartCommandRequest } from '../command/delete-to-cart.command.request';
import { GetToCartUseCase } from '../../../application/port/in/get-to-cart.usecase';
import { AddToCartUseCase } from '../../../application/port/in/add-to-cart.usecase';
import { DeleteToCartUseCase } from '../../../application/port/in/delete-to-cart.usecase';

/**
 * APIのエンドポイント
 */
@Controller('get-to-cart')
export class CartController {
  // APIが実行すべきユースケースをDIする
  constructor(
    @Inject('GetToCartService') private readonly getToCartService: GetToCartUseCase,
    @Inject('AddToCartService') private readonly addToCartService: AddToCartUseCase,
    @Inject('DeleteToCartService') private readonly deleteToCartService: DeleteToCartUseCase
  ) {}

  @Get()
  // @TODO 本来はもっと実装が必要
  public async getToCarts() {
    return this.getToCartService.getItems();
  }

  @Get(':userId')
  // @TODO 本来はもっと実装が必要
  public async getToCart(@Param('userId') id: number) {
    const [cmd, cmdError] = GetToCartCommandRequest.createCommand(id);
    // このエラーはバリデーションエラー
    if (cmdError) {
      // @TODO エラーレスポンスを返す
      return
    }

    return this.getToCartService.getItem(cmd)
  }

  @MessagePattern('dbserver1.public.cart_items')
  async handleCartItemsEvent(@Payload() message: any) {
    if (!message) {
      return;
    }

    const { payload } = message;

    if (!payload) {
      return;
    }

    if (!payload.op) {
      return;
    }

    // 例：データの種類を判定
    if (payload.op === 'c') {
      const [cmd, cmdError] = AddToCartItemCommandRequest.createCommand(
        payload.after.id,
        payload.after.sku_code,
        payload.after.price,
        payload.after.quantity,
        payload.after.cart_id
      );
      // このエラーはバリデーションエラー
      if (cmdError) {
        // @TODO エラーレスポンスを返す
        return;
      }

      // ユースケースを実行
      const error = await this.addToCartService.addCartItem(cmd);
      console.log('Received CDC event Cart Item Created:', payload.after);
    }
  }

  @MessagePattern('dbserver1.public.carts')
  async handleCartsEvent(@Payload() message: any) {
    if (!message) {
      return;
    }

    const { payload } = message;

    if (!payload) {
      return;
    }

    if (!payload.op) {
      return;
    }

    // 例：データの種類を判定
    if (payload.op === 'c') {
      const [cmd, cmdError] = AddToCartCommandRequest.createCommand(
        payload.after.id,
        payload.after.user_uuid,
        payload.after.cart_code,
      );
      // このエラーはバリデーションエラー
      if (cmdError) {
        // @TODO エラーレスポンスを返す
        return;
      }

      // ユースケースを実行
      const error = await this.addToCartService.addItem(cmd);
      console.log('Received CDC event Cart Created:', payload.after);
    }

    if (payload.op === 'd') {
      const [cmd, cmdError] = DeleteToCartCommandRequest.createCommand(
        payload.before.id
      );
      // このエラーはバリデーションエラー
      if (cmdError) {
        // @TODO エラーレスポンスを返す
        return;
      }

      // ユースケースを実行
      await this.deleteToCartService.deleteCartItem(cmd);
      await this.deleteToCartService.deleteItem(cmd);
      console.log('Received CDC event Cart Deleted:', payload.before);
    }
  }
}
