import SchemaBuilder from '@pothos/core';

const builder = new SchemaBuilder({});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `Hello, ${name || 'World!'}`,
    }),
  }),
});

export const schema = builder.toSchema({});
