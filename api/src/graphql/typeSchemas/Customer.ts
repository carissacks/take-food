import { builder } from '../../builder';

builder.prismaObject('Customer', {
  findUnique: (customer) => ({ id: customer.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    email: t.exposeString('email'),
    favoriteRestaurant: t.relation('favoriteRestaurants'),
    orderHistory: t.relation('orderHistory'),
  }),
});
