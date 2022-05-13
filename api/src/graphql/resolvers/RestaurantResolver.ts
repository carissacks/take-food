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
  updateRestaurant: t.prismaField({
    type: 'Restaurant',
    args: {
      id: t.arg.id({ required: true }),
      name: t.arg.string(),
      email: t.arg.string(),
      password: t.arg.string(),
    },
    resolve: async (query, _root, args, _ctx, _info) => {
      const { id, name, email, password } = args;

      const restaurant = await db.restaurant.findUnique({
        ...query,
        where: { id: id.toString() },
      });

      if (!restaurant) {
        throw new Error('Restaurant does not exist');
      }

      return db.restaurant.update({
        ...query,
        where: { id: id.toString() },
        data: {
          name: name ?? restaurant.name,
          email: email ?? restaurant.email,
          password: password ?? restaurant.password,
        },
      });
    },
  }),
}));
