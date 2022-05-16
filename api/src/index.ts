import { createServer } from '@graphql-yoga/node';
import { initContextCache } from '@pothos/core';

import { decodeJWT } from './helpers/jwt';
import { schema } from './schema';

const server = createServer({
  schema,
  context: ({ req }) => {
    const token = req.headers.authorization ?? '';
    const accountId = decodeJWT(token);

    return { ...initContextCache(), accountId };
  },
});

server.start();
