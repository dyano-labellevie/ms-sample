import { Controller, Get, Param, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { MessagePattern, Payload, ClientKafka } from '@nestjs/microservices';
import { GetToCartAllQueryRequest } from '../query/get-to-cart-all.query.request';
import { GetToCartQueryRequest } from '../query/get-to-cart.query.request';
import { AddToCartItemCommandRequest } from '../command/add-to-cart-item.command.request';
import { AddToCartCommandRequest } from '../command/add-to-cart.command.request';
import { DeleteToCartItemCommandRequest } from '../command/delete-to-cart-item.command.request';
import { DeleteToCartCommandRequest } from '../command/delete-to-cart.command.request';

/**
 * APIのエンドポイント
 */
@Controller('get-to-cart')
export class CartController implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
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
    const [query, queryError] = GetToCartAllQueryRequest.createQuery();
    // このエラーはバリデーションエラー
    if (queryError) {
      // @TODO エラーレスポンスを返す
      return
    }

    return this.queryBus.execute(query);
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

    return await this.queryBus.execute(query);
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

      const error = await this.commandBus.execute(cmd);
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

      const error = await this.commandBus.execute(cmd);
      console.log('Received CDC event Cart Created:', payload.after);
    }

    if (payload.op === 'd') {
      const [cmd1, cmdError1] = DeleteToCartItemCommandRequest.createCommand(
        payload.before.id
      );
      const [cmd2, cmdError2] = DeleteToCartCommandRequest.createCommand(
        payload.before.id
      );
      // このエラーはバリデーションエラー
      if (cmdError1 || cmdError2) {
        // @TODO エラーレスポンスを返す
        return;
      }

      await this.commandBus.execute(cmd1);
      await this.commandBus.execute(cmd2);
      console.log('Received CDC event Cart Deleted:', payload.before);
    }
  }
}
