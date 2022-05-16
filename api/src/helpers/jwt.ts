import jwt from 'jsonwebtoken';

import { SECRET_KEY } from '../general/constants';

const generateJWT = (data: string) => {
  return jwt.sign(data, SECRET_KEY);
};

const decodeJWT = (token: string) => {
  try {
    const result = jwt.verify(token, SECRET_KEY);
    return typeof result === 'string' ? result : '';
  } catch {
    return '';
  }
};

export { generateJWT, decodeJWT };
