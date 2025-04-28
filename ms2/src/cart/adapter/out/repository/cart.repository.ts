import { Injectable, Inject } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { GetCartPort } from '../../../application/port/out/get-cart.port';
import { SaveCartPort } from '../../../application/port/out/save-cart.port';
import { DeleteCartPort } from '../../../application/port/out/delete-cart.port';
import * as schema from '../../../../db/schema';
import { Cart } from '../../../application/domain/model/cart.entity';
import { CartItem } from '../../../application/domain/model/cart-item.entity';
import { ThisError } from 'src/error/this-error';

@Injectable()
export class CartRepository implements GetCartPort, SaveCartPort, DeleteCartPort {
  constructor(
    @Inject('DB_DEV') private readonly drizzle: PostgresJsDatabase<typeof schema>,
  ) {}

  async findAll(): Promise<Cart[] | ThisError> {
    const cartsData = await this.drizzle.query.carts.findMany({
      with: {
        cartItems: true,
      },
    });
    const carts = cartsData.map((cartData) => {
      const cart = Cart.init(
        cartData.id,
        cartData.userUuid!,
        cartData.cartCode!
      );
      cartData.cartItems.map((cartItemData) => {
        const cartItem = CartItem.init(
          cartItemData.id,
          cartItemData.skuCode!,
          cartItemData.price!,
          cartItemData.quantity!,
          cartItemData.cartId!
        );
        cart.addItem(cartItem);
      });
      return cart;
    });
    return carts;
  }

  async findOne(id: number): Promise<Cart | ThisError> {
    const cartData = await this.drizzle.query.carts.findFirst({
      with: {
        cartItems: true,
      },
      where(fields) {
        return eq(fields.id, id);
      },
    });
    const cart = Cart.init(
      cartData!.id,
      cartData?.userUuid!,
      cartData?.cartCode!
    );
    cartData?.cartItems.map((cartItemData) => {
      const cartItem = CartItem.init(
        cartItemData.id,
        cartItemData.skuCode!,
        cartItemData.price!,
        cartItemData.quantity!,
        cartItemData.cartId!
      );
      cart.addItem(cartItem);
    });
    return cart;
  }

  async save(cart: {
    userUuid: string;
    cartCode: string;
    items: { skuCode: string; price: number; quantity: number }[];
  }): Promise<void | ThisError> {
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
  }): Promise<void | ThisError> {
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
  }): Promise<void | ThisError> {
    await this.drizzle
      .insert(schema.carts)
      .values({ ...cart });
  }

  async deleteCartItem(cart: {
    cartId: number;
  }): Promise<void | ThisError> {
    await this.drizzle
      .delete(schema.cartItems)
      .where(eq(schema.cartItems.cartId, cart.cartId));
  }

  async deleteCart(cart: {
    cartId: number;
  }): Promise<void | ThisError> {
    await this.drizzle
      .delete(schema.carts)
      .where(eq(schema.carts.id, cart.cartId));
  }
}
