import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../../../constants';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res
      .status(401)
      .send({ message: 'Token de autenticação não fornecido!' });
  }

  const authParts = authorization.split(' ');

  if (authParts.length !== 2) {
    return res.status(401).send({ message: 'Token de autenticação inválido!' });
  }

  const [scheme, token] = authParts;

  if (!/^Bearer$/i.test(scheme)) {
    return res
      .status(401)
      .send({ message: 'Token de autenticação mal formatado!' });
  }

  try {
    const data = jwt.verify(token, SECRET);

    const { id } = data as TokenPayload;

    req.userId = id;

    return next();
  } catch {
    return res.status(401).send({ message: 'Autenticação inválida!' });
  }
}
