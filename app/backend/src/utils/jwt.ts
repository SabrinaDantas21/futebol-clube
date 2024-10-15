import * as jwt from 'jsonwebtoken';

export interface Payload {
  id: number,
  username: string,
  role: string,
  email: string,
}

export default class JwtUtils {
  private secret: string ;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'password';
  }

  createToken(payload: Payload) {
    const token = jwt.sign(payload, this.secret);
    return token;
  }

  validateTokem(token: string): Payload {
    const payload = jwt.verify(token, this.secret) as Payload;
    return payload;
  }
}
