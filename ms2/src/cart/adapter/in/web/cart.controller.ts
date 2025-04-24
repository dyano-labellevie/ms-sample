import { Controller, Get, Param, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { MessagePattern, Payload, ClientKafka } from '@nestjs/microservices';
import { GetToCartQueryRequest } from '../query/get-to-cart.query.request';
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
export class CartController implements OnModuleInit, OnModuleDestroy {
  // APIが実行すべきユースケースをDIする
  constructor(
    @Inject('GetToCartService') private readonly getToCartService: GetToCartUseCase,
    @Inject('AddToCartService') private readonly addToCartService: AddToCartUseCase,
    @Inject('DeleteToCartService') private readonly deleteToCartService: DeleteToCartUseCase,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka
  ) {}

  async onModuleInit() {
    await this.kafkaClient.subscribeToResponseOf('dbserver1.public.cart_items');
    await this.kafkaClient.subscribeToResponseOf('dbserver1.public.carts');
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  @Get()
  // @TODO 本来はもっと実装が必要
  public async getToCarts() {
    return this.getToCartService.getItems();
  }

  @Get(':userId')
  // @TODO 本来はもっと実装が必要
  public async getToCart(@Param('userId') id: number) {
    const [query, queryError] = GetToCartQueryRequest.createQuery(id);
    // このエラーはバリデーションエラー
    if (queryError) {
      // @TODO エラーレスポンスを返す
      return
    }

    return this.getToCartService.getItem(query)
  }

  @MessagePattern('dbserver1.public.cart_items')
  async handleCartItemsEvent(@Payload() message: any) {
    if (!message) {
      return;
    }

    const { payload } = message;

    if (!payload || !payload.op) {
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

    if (!payload || !payload.op) {
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
