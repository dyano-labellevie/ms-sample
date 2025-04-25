import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ThisError } from '../../../../error/this-error';
import { GetToCartAllUseCase } from '../../port/in/query/get-to-cart-all.usecase';
import { GetToCartAllQuery } from '../../port/in/query/get-to-cart-all.query';
import { GetToCartAllQueryRequest } from '../../../adapter/in/query/get-to-cart-all.query.request';
import { GetCartPort } from '../../port/out/get-cart.port';

/**
 * 入力Port（GetToCartAllUseCase）を実装しているハンドラ
 */
@QueryHandler(GetToCartAllQueryRequest)
export class GetToCartAllHandler implements IQueryHandler<GetToCartAllQuery>, GetToCartAllUseCase {
  public constructor(
    @Inject('CartRepository') private readonly cartRepository: GetCartPort
  ) {}

  async execute(query: GetToCartAllQuery): Promise<any[] | ThisError> {
    return await this.cartRepository.findAll();
  }
}
