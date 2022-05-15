import { builder } from '../../builder';
import { db } from '../../db';
import { ProductType } from '../typeSchemas/Product';

builder.queryFields((t) => ({
  product: t.prismaField({
    type: 'Product',
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _root, args, _ctx, _info) =>
      db.product.findUnique({
        ...query,
        rejectOnNotFound: true,
        where: { id: args.id.toString() },
      }),
  }),
  products: t.prismaField({
    type: ['Product'],
    args: { restaurantId: t.arg.id({ required: true }) },
    resolve: async (query, _root, args, _ctx, _info) => {
      const restaurant = await db.restaurant.findUnique({
        ...query,
        where: { id: args.restaurantId.toString() },
      });

      if (!restaurant) {
        throw new Error('Restaurant does not exist');
      }

      return db.product.findMany({
        ...query,
        where: { restaurantId: args.restaurantId.toString() },
      });
    },
  }),
}));

builder.mutationFields((t) => ({
  createProduct: t.prismaField({
    type: 'Product',
    args: {
      name: t.arg.string({ required: true }),
      type: t.arg({ type: ProductType }),
      price: t.arg.int({ required: true }),
      restaurantId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, args, _ctx, _info) => {
      const { name, type, price, restaurantId } = args;

      const restaurant = await db.restaurant.findUnique({
        ...query,
        where: { id: restaurantId.toString() },
      });

      if (!restaurant) {
        throw new Error('Restaurant does not exist');
      }

      return db.product.create({
        ...query,
        data: {
          name,
          type: type ?? 'FOOD',
          price,
          restaurantId: restaurantId.toString(),
        },
      });
    },
  }),
  updateProduct: t.prismaField({
    type: 'Product',
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string(),
      type: t.arg({ type: ProductType }),
      price: t.arg.int(),
    },
    resolve: async (query, _root, args, _ctx, _info) => {
      const { id, name, type, price } = args;

      const product = await db.product.findUnique({
        ...query,
        where: { id: id.toString() },
      });

      if (!product) {
        throw new Error('Product does not exist');
      }

      return db.product.update({
        ...query,
        where: { id: id.toString() },
        data: {
          name: name ?? product.name,
          type: type ?? product.type,
          price: price ?? product.price,
        },
      });
    },
  }),
  deleteProduct: t.prismaField({
    type: 'Product',
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _root, { id }, _ctx, _info) =>
      db.product.delete({ ...query, where: { id: id.toString() } }),
  }),
}));