import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/validateToken';
import LoginService from '../services/loginService';

class LoginController {
  private loginService = new LoginService();
  private role!: string;

  async login(req: Request, res: Response): Promise<Response> {
    const loginData = req.body;
    const { status, message, token } = await this.loginService.login(loginData);

    this.role = '';

    if (status !== 200) {
      return res.status(status).json({ message });
    }

    return res.status(status).json({ token });
  }

  public async getRole(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    this.role = req.user.role;
    return res.status(200).json({ role: this.role });
  }
}

export default LoginController;
