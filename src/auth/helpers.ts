import { Request, Response } from 'express';

export function extractJwtToken(req: Request) {
  const result = { success: false, token: '' };

  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) return result;

  const token = authorization.split(' ')[1];
  if (!token) return result;

  result.token = token;
  result.success = true;
  return result;
}
