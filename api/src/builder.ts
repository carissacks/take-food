import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import ErrorsPlugin from '@pothos/plugin-errors';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';

import { db } from './db';
import { AccountType } from './types/types';

type Context = {
  accountId: string;
  accountType: AccountType;
};

type Objects = {
  Auth: {
    token: string;
  };
};

type AuthScopes = {
  isAuthenticated: boolean;
  accountType: AccountType;
};

export const builder = new SchemaBuilder<{
  Context: Context;
  Objects: Objects;
  AuthScopes: AuthScopes;
  PrismaTypes: PrismaTypes;
}>({
  plugins: [ErrorsPlugin, ScopeAuthPlugin, PrismaPlugin],
  errorOptions: {
    defaultTypes: [Error],
  },
  authScopes: async (context) => ({
    isAuthenticated: context.accountId !== '',
    accountType: (type) => context.accountType === type,
  }),
  scopeAuthOptions: {
    unauthorizedError: () => new Error('Not authorized'),
  },
  prisma: {
    client: db,
  },
});

builder.queryType({});
builder.mutationType({});
