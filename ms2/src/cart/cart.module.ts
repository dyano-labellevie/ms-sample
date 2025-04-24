import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AddToCartService } from './application/domain/service/add-to-cart.service';
import { GetToCartService } from './application/domain/service/get-to-cart.service';
import { DeleteToCartService } from './application/domain/service/delete-to-cart.service';
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
      provide: 'AddToCartService',
      useClass: AddToCartService,
    },
    {
      provide: 'GetToCartService',
      useClass: GetToCartService,
    },
    {
      provide: 'DeleteToCartService',
      useClass: DeleteToCartService,
    },
    {
      provide: 'CartRepository',
      useClass: CartRepository,
    },
  ],
})
export class CartModule {}
