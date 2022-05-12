import { builder } from './builder';

import './graphql/typeSchemas/Customer';
import './graphql/typeSchemas/Restaurant';

import './graphql/resolvers/CustomerResolver';
import './graphql/resolvers/RestaurantResolver';

export const schema = builder.toSchema({});
