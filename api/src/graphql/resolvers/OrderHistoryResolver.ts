import { builder } from '../../builder';
import { db } from '../../db';
import { DataNotFoundError } from '../errorTypes';

builder.queryFields((t) => ({
  orderHistory: t.prismaField({
    type: ['OrderHistory'],
    errors: {
      types: [DataNotFoundError],
    },
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, _ctx, _info) => {
      const customerOrderHistory = await db.orderHistory.findMany({
        ...query,
        where: { customerId: id.toString() },
      });

      if (customerOrderHistory.length > 0) {
        return customerOrderHistory;
      }

      const restaurantOrderHistory = await db.orderHistory.findMany({
        ...query,
        where: { restaurantId: id.toString() },
      });

      if (restaurantOrderHistory.length > 0) {
        return restaurantOrderHistory;
      }

      const productOrderHistory = await db.orderHistory.findMany({
        ...query,
        where: { products: { every: { id: id.toString() } } },
      });

      if (productOrderHistory.length === 0) {
        throw new DataNotFoundError('Order History', id.toString());
      }

      return productOrderHistory;
    },
  }),
}));

builder.mutationFields((t) => ({
  createOrderHistory: t.prismaField({
    type: 'OrderHistory',
    args: {
      customerId: t.arg.id({ required: true }),
      restaurantId: t.arg.id({ required: true }),
      productIds: t.arg.idList({ required: true }),
    },
    resolve: async (query, _root, args, _ctx, _info) => {
      const { customerId, restaurantId, productIds } = args;

      const formattedProductIds = productIds.map((productId) => ({
        id: productId.toString(),
      }));

      return db.orderHistory.create({
        ...query,
        data: {
          customer: { connect: { id: customerId.toString() } },
          restaurant: { connect: { id: restaurantId.toString() } },
          products: { connect: formattedProductIds },
        },
      });
    },
  }),
}));
