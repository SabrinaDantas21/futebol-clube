import { compareSync } from 'bcryptjs';
import User from '../database/models/UsersModel';
import JwtUtils from '../utils/jwt';
import { Login } from '../Interfaces/login';

export default class LoginService {
  private model = User;

  async login({ email, password }: Login) {
    if (!email || !password) {
      return { status: 400, message: 'All fields must be filled' };
    }

    const user = await this.model.findOne({ where: { email }, raw: true });
    if (!user || !compareSync(password, user.password)) {
      return { status: 401, message: 'Invalid email or password' };
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = new JwtUtils().createToken(userWithoutPassword);

    return { status: 200, token };
  }
}
