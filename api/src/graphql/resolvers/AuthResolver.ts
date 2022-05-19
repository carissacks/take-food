import bcrypt from 'bcrypt';

import { builder } from '../../builder';
import { db } from '../../db';
import { SALT_ROUNDS } from '../../general/constants';
import { generateJWT } from '../../helpers/jwt';
import { AccountType } from '../../types/types';

const AccountType = builder.enumType('AccountType', {
  values: ['Customer', 'Restaurant'] as const,
});

builder.mutationFields((t) => ({
  register: t.field({
    type: 'Auth',
    args: {
      accountType: t.arg({ type: AccountType, required: true }),
      name: t.arg.string({ required: true }),
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_root, args, _ctx, _info) => {
      const { accountType, name, email, password } = args;

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      let accountId;
      if (accountType === 'Customer') {
        const customer = await db.customer.create({
          data: { name, email, password: hashedPassword },
        });
        accountId = customer.id;
      } else {
        const restaurant = await db.restaurant.create({
          data: { name, email, password: hashedPassword },
        });
        accountId = restaurant.id;
      }

      return { token: generateJWT({ accountId, accountType }) };
    },
  }),
  login: t.field({
    type: 'Auth',
    errors: {
      types: [Error],
    },
    args: {
      email: t.arg.string({ required: true }),
      password: t.arg.string({ required: true }),
    },
    resolve: async (_root, args, _ctx, _info) => {
      const { email, password } = args;

      let accountId;
      let accountPassword;
      let accountType: AccountType;

      const customer = await db.customer.findUnique({ where: { email } });
      if (customer) {
        accountId = customer.id;
        accountPassword = customer.password;
        accountType = 'Customer';
      } else {
        const restaurant = await db.restaurant.findUnique({ where: { email } });
        if (!restaurant) {
          throw new Error('Incorrect email or password');
        }
        accountId = restaurant.id;
        accountPassword = restaurant.password;
        accountType = 'Restaurant';
      }

      const isPasswordValid = await bcrypt.compare(password, accountPassword);

      if (!isPasswordValid) {
        throw new Error('Incorrect email or password');
      }

      return { token: generateJWT({ accountId, accountType }) };
    },
  }),
}));
