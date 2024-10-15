import { Router } from 'express';
import TokenValidator from '../middlewares/validateToken';
import LoginController from '../controllers/loginController';

const router = Router();
const loginController = new LoginController();

router.post('/login', (req, res) => loginController.login(req, res));
router.get('/login/role', TokenValidator.validateToken, (
  req,
  res,
) => loginController.getRole(req, res));

export default router;
