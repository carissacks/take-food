import SchemaBuilder from '@pothos/core';
import ErrorsPlugin from '@pothos/plugin-errors';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';

import { db } from './db';

type Context = {
  accountId: string;
};

type Objects = {
  Auth: {
    token: string;
  };
};

export const builder = new SchemaBuilder<{
  Context: Context;
  Objects: Objects;
  PrismaTypes: PrismaTypes;
}>({
  plugins: [ErrorsPlugin, PrismaPlugin],
  errorOptions: {
    defaultTypes: [Error],
  },
  prisma: {
    client: db,
  },
});

builder.queryType({});
builder.mutationType({});
