import { Request, Response, NextFunction } from 'express';
import JwtUtils, { Payload } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: Payload;
}

class TokenValidator {
  private jwtUtils: JwtUtils;

  constructor() {
    this.jwtUtils = new JwtUtils();
  }

  public validateToken(req: AuthenticatedRequest, res: Response, next:
  NextFunction): Response | void {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: 'Token not found' });
    }

    try {
      const token = authorization.split(' ')[1];
      const user = this.jwtUtils.validateToken(token);

      if (!user) {
        return res.status(401).json({ message: 'Token must be a valid token' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token must be a valid token' });
    }
  }
}

export default new TokenValidator();
