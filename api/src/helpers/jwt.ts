import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../general/constants';
import { AccountType } from '../types/types';

type PayloadType = {
  accountId: string;
  accountType: AccountType;
};

const generateJWT = (payload: PayloadType) => {
  return jwt.sign(payload, SECRET_KEY);
};

const decodeJWT = (token: string) => {
  const defaultValues = {
    accountId: '',
    accountType: '',
  };

  try {
    const result = jwt.verify(token, SECRET_KEY) as PayloadType;
    return result.accountId ? result : defaultValues;
  } catch {
    return defaultValues;
  }
};

export { generateJWT, decodeJWT };
