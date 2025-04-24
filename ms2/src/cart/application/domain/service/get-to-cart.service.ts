import { Inject, Injectable } from '@nestjs/common';
import { ThisError } from '../../../../error/this-error';
import { GetToCartUseCase } from '../../port/in/get-to-cart.usecase';
import { GetToCartQuery } from '../../port/in/get-to-cart.query';
import { GetCartPort } from '../../port/out/get-cart.port';

/**
 * 入力Port（GetToCartUsecase）を実装しているサービス
 */
@Injectable()
export class GetToCartService implements GetToCartUseCase {
  // Interfaceを利用してDIしているので、下記の様な記述が必要となる
  public constructor(
    @Inject('CartRepository') private readonly cartRepository: GetCartPort
  ) {}

  /**
   * Cart一覧を取得する
   * @returns
   */
  public async getItems(): Promise<void | ThisError> {
    return await this.cartRepository.findAll();
  }

  /**
   * Cartを取得する
   * @param query
   * @returns
   */
  public async getItem(query: GetToCartQuery): Promise<void | ThisError> {
    return await this.cartRepository.findOne(query.cartId);
  }
}
