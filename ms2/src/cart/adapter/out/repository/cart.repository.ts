import { Injectable, Inject } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { GetCartPort } from '../../../application/port/out/get-cart.port';
import { SaveCartPort } from '../../../application/port/out/save-cart.port';
import { DeleteCartPort } from '../../../application/port/out/delete-cart.port';
import * as schema from '../../../../db/schema';

@Injectable()
export class CartRepository implements GetCartPort, SaveCartPort, DeleteCartPort {
  constructor(
    @Inject('DB_DEV') private readonly drizzle: PostgresJsDatabase<typeof schema>,
  ) {}

  async findAll() {
    return await this.drizzle.query.carts.findMany({
      with: {
        cartItems: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.drizzle.query.carts.findFirst({
      with: {
        cartItems: true,
      },
      where(fields) {
        return eq(fields.id, id);
      },
    });
  }

  async save(cart: {
    userUuid: string;
    cartCode: string;
    items: { skuCode: string; price: number; quantity: number }[];
  }): Promise<void> {
    const { userUuid, cartCode, items } = cart;
    const insertedCarts = await this.drizzle
      .insert(schema.carts)
      .values({ userUuid, cartCode })
      .returning({ id: schema.carts.id });

    const cartId = insertedCarts[0].id;

    for (const item of items) {
      await this.drizzle
        .insert(schema.cartItems)
        .values({
          cartId,
          ...item,
        });
    }
  }

  async saveCartItem(cartItem: {
    id: number;
    skuCode: string;
    price: number;
    quantity: number;
    cartId: number;
  }): Promise<void> {
    let cart;
    while (!cart) {
      cart = await this.drizzle.query.carts.findFirst({
        where(fields) {
          return eq(fields.id, cartItem.cartId);
        },
      });
    }

    await this.drizzle
      .insert(schema.cartItems)
      .values({ ...cartItem });
  }

  async saveCart(cart: {
    id: number;
    userUuid: string;
    cartCode: string;
  }): Promise<void> {
    await this.drizzle
      .insert(schema.carts)
      .values({ ...cart });
  }

  async deleteCartItem(cart: {
    cartId: number;
  }): Promise<void> {
    await this.drizzle
      .delete(schema.cartItems)
      .where(eq(schema.cartItems.cartId, cart.cartId));
  }

  async deleteCart(cart: {
    cartId: number;
  }): Promise<void> {
    await this.drizzle
      .delete(schema.carts)
      .where(eq(schema.carts.id, cart.cartId));
  }
}
