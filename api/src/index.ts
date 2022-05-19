import { createServer } from '@graphql-yoga/node';
import { initContextCache } from '@pothos/core';

import { decodeJWT } from './helpers/jwt';
import { schema } from './schema';

const server = createServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization ?? '';
    const { accountId, accountType } = decodeJWT(token);

    return { ...initContextCache(), accountId, accountType };
  },
});

server.start();
