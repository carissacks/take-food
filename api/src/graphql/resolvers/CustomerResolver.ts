import { builder } from '../../builder';
import { db } from '../../db';

builder.queryFields((t) => ({
  customer: t.prismaField({
    type: 'Customer',
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _root, args, _ctx, _info) =>
      db.customer.findUnique({
        ...query,
        rejectOnNotFound: true,
        where: { id: args.id.toString() },
      }),
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
      db.customer.create({ ...query, data: { name, email, password } }),
  }),
}));
