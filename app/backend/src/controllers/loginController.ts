import { Request, Response } from 'express';
import LoginService from '../services/loginService';

export default class LoginController {
  private loginService = new LoginService();

  async login(req: Request, res: Response): Promise<Response> {
    const loginData = req.body;
    const { status, message, token } = await this.loginService.login(loginData);

    if (status !== 200) {
      return res.status(status).json({ message });
    }

    return res.status(status).json({ token });
  }
}
