import { builder } from '../../builder';

builder.prismaObject('Restaurant', {
  findUnique: (restaurant) => ({ id: restaurant.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    products: t.relation('products'),
    favoredByCustomers: t.relation('favoredByCustomers'),
    orderHistory: t.relation('orderHistory'),
  }),
});
