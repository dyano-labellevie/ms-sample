import {
  pgTable,
  serial,
  integer,
  bigint,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const carts = pgTable('carts', {
  id: serial('id').primaryKey(),
  userUuid: varchar('user_uuid', { length: 256 }),
  cartCode: varchar('cart_code', { length: 256 }),
});

export const cartsRelations = relations(carts, ({ many }) => ({
  cartItems: many(cartItems),
}));

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  skuCode: varchar('sku_code', { length: 256 }),
  price: integer('price'),
  quantity: integer('quantity'),
  cartId: bigint('cart_id', { mode: 'number' }).references(() => carts.id),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
}));
