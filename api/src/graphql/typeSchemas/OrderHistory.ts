import { builder } from '../../builder';

builder.prismaObject('OrderHistory', {
  findUnique: (orderHistory) => ({ id: orderHistory.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    customer: t.relation('customer'),
    restaurant: t.relation('restaurant'),
    products: t.relation('products'),
  }),
});
