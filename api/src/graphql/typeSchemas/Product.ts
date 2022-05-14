import { builder } from '../../builder';

export const ProductType = builder.enumType('ProductType', {
  values: ['FOOD', 'BEVERAGE'] as const,
});

builder.prismaObject('Product', {
  findUnique: (product) => ({ id: product.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    type: t.field({
      type: ProductType,
      resolve: (root) => root.type,
    }),
    price: t.exposeInt('price'),
    restaurant: t.relation('restaurant'),
    orderHistory: t.relation('orderHistory'),
  }),
});
