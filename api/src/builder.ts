import SchemaBuilder from '@pothos/core';
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
  plugins: [PrismaPlugin],
  prisma: {
    client: db,
  },
});

builder.queryType({});
builder.mutationType({});
