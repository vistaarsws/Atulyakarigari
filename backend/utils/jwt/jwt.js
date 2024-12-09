import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

export const generateToken = (payload, expiresIn = process.env.JWT_EXPIRY) => 
  jwt.sign(payload, JWT_SECRET, { expiresIn });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
