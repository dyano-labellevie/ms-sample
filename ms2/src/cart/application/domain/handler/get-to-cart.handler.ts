import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ThisError } from '../../../../error/this-error';
import { GetToCartUseCase } from '../../port/in/query/get-to-cart.usecase';
import { GetToCartQuery } from '../../port/in/query/get-to-cart.query';
import { GetToCartQueryRequest } from '../../../adapter/in/query/get-to-cart.query.request';
import { GetCartPort } from '../../port/out/get-cart.port';

/**
 * 入力Port（GetToCartUsecase）を実装しているハンドラ
 */
@QueryHandler(GetToCartQueryRequest)
export class GetToCartHandler implements IQueryHandler<GetToCartQuery>, GetToCartUseCase {
  public constructor(
    @Inject('CartRepository') private readonly cartRepository: GetCartPort
  ) {}

  async execute(query: GetToCartQuery): Promise<any | ThisError> {
    return await this.cartRepository.findOne(query.cartId);
  }
}
