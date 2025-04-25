import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GetToCartAllHandler } from './application/handler/get-to-cart-all.handler';
import { GetToCartHandler } from './application/handler/get-to-cart.handler';
import { AddToCartItemHandler } from './application/handler/add-to-cart-item.handler';
import { AddToCartHandler } from './application/handler/add-to-cart.handler';
import { DeleteToCartItemHandler } from './application/handler/delete-to-cart-item.handler';
import { DeleteToCartHandler } from './application/handler/delete-to-cart.handler';
import { CartRepository } from './adapter/out/repository/cart.repository';
import { CartController } from './adapter/in/web/cart.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'cart-kafka1',
            brokers: ['broker1:9092', 'broker2:9093'],
          },
          consumer: {
            groupId: 'cart-consumer-group1',
          },
        },
      },
    ])
  ],
  controllers: [
    CartController,
  ],
  providers: [
    {
      provide: 'GetToCartAllHandler',
      useClass: GetToCartAllHandler,
    },
    {
      provide: 'GetToCartHandler',
      useClass: GetToCartHandler,
    },
    {
      provide: 'AddToCartItemHandler',
      useClass: AddToCartItemHandler,
    },
    {
      provide: 'AddToCartHandler',
      useClass: AddToCartHandler,
    },
    {
      provide: 'DeleteToCartItemHandler',
      useClass: DeleteToCartItemHandler,
    },
    {
      provide: 'DeleteToCartHandler',
      useClass: DeleteToCartHandler,
    },
    {
      provide: 'CartRepository',
      useClass: CartRepository,
    },
  ],
})
export class CartModule {}
