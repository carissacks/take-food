import { builder } from '../builder';

const ErrorInterface = builder.interfaceRef<Error>('Error').implement({
  fields: (t) => ({
    message: t.exposeString('message'),
  }),
});

builder.objectType(Error, {
  name: 'BaseError',
  interfaces: [ErrorInterface],
});

export class DataNotFoundError extends Error {
  constructor(
    readonly data: 'Customer' | 'Restaurant' | 'Product' | 'Order History',
    readonly id: string,
  ) {
    super(`${data} with id ${id} not found`);
    this.name = 'DataNotFoundError';
  }
}

builder.objectType(DataNotFoundError, {
  name: 'DataNotFoundError',
  interfaces: [ErrorInterface],
  fields: (t) => ({
    data: t.exposeString('data'),
    id: t.exposeString('id'),
  }),
});
