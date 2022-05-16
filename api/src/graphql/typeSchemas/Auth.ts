import { builder } from '../../builder';

builder.objectType('Auth', {
  fields: (t) => ({
    token: t.exposeString('token'),
  }),
});
