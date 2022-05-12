import { builder } from '../../builder';
import { db } from '../../db';

builder.queryFields((t) => ({
  restaurant: t.prismaField({
    type: 'Restaurant',
    nullable: true,
    args: { id: t.arg.id({ required: true }) },
    resolve: async (query, _root, args, _ctx, _info) =>
      db.restaurant.findUnique({
        ...query,
        rejectOnNotFound: true,
        where: { id: args.id.toString() },
      }),
  }),
  restaurants: t.prismaField({
    type: ['Restaurant'],
    resolve: async (query, _root, _args, _ctx, _info) =>
      db.restaurant.findMany({ ...query }),
  }),
}));

builder.mutationFields((t) => ({
  createRestaurant: t.prismaField({
    type: 'Restaurant',
    args: {
      name: t.arg.string({ required: true }),
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (query, _root, { name, email, password }, _ctx, _info) =>
      db.restaurant.create({ ...query, data: { name, email, password } }),
  }),
}));
