import bcrypt from 'bcrypt';

import { builder } from '../../builder';
import { db } from '../../db';
import { SALT_ROUNDS } from '../../general/constants';
import { DataNotFoundError } from '../errorTypes';

const OperationType = builder.enumType('OperationType', {
  values: ['ADD', 'DELETE'] as const,
});

builder.queryFields((t) => ({
  customer: t.prismaField({
    type: 'Customer',
    authScopes: (_root, args, ctx, _info) =>
      args.id === ctx.accountId ? { accountType: 'Customer' } : false,
    errors: {
      types: [DataNotFoundError],
    },
    args: {
      id: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, { id }, _ctx, _info) => {
      const customer = await db.customer.findUnique({
        ...query,
        where: { id: id.toString() },
      });

      if (!customer) {
        throw new DataNotFoundError('Customer', id.toString());
      }

      return customer;
    },
  }),
  customers: t.prismaField({
    type: ['Customer'],
    resolve: async (query, _root, _args, _ctx, _info) =>
      db.customer.findMany({ ...query }),
  }),
}));

builder.mutationFields((t) => ({
  createCustomer: t.prismaField({
    type: 'Customer',
    args: {
      name: t.arg.string({ required: true }),
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, { name, email, password }, _ctx, _info) =>
      db.customer.create({
        ...query,
        data: {
          name,
          email,
          password: await bcrypt.hash(password, SALT_ROUNDS),
        },
      }),
  }),
  updateCustomer: t.prismaField({
    type: 'Customer',
    authScopes: (_root, args, ctx, _info) =>
      args.id === ctx.accountId ? { accountType: 'Customer' } : false,
    errors: {
      types: [DataNotFoundError],
    },
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string(),
      email: t.arg.string(),
      password: t.arg.string(),
    },
    resolve: async (query, _root, args, _ctx, _info) => {
      const { id, name, email, password } = args;

      const customer = await db.customer.findUnique({
        ...query,
        where: { id: id.toString() },
      });

      if (!customer) {
        throw new DataNotFoundError('Customer', id.toString());
      }

      return db.customer.update({
        ...query,
        where: { id: id.toString() },
        data: {
          name: name ?? customer.name,
          email: email ?? customer.email,
          password: password
            ? await bcrypt.hash(password, SALT_ROUNDS)
            : customer.password,
        },
      });
    },
  }),
  favoriteRestaurant: t.prismaField({
    type: 'Customer',
    authScopes: (_root, args, ctx, _info) =>
      args.customerId === ctx.accountId ? { accountType: 'Customer' } : false,
    args: {
      operation: t.arg({ type: OperationType, required: true }),
      customerId: t.arg.id({ required: true }),
      restaurantId: t.arg.id({ required: true }),
    },
    resolve: async (query, _root, args, _ctx, _info) => {
      const { operation, customerId, restaurantId } = args;

      return operation === 'ADD'
        ? db.customer.update({
            ...query,
            where: { id: customerId.toString() },
            data: {
              favoriteRestaurants: {
                connect: { id: restaurantId.toString() },
              },
            },
          })
        : db.customer.update({
            ...query,
            where: { id: customerId.toString() },
            data: {
              favoriteRestaurants: {
                disconnect: { id: restaurantId.toString() },
              },
            },
          });
    },
  }),
}));
