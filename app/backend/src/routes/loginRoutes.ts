import { Router } from 'express';
import TokenValidator from '../middlewares/validateToken';
import LoginController from '../controllers/loginController';

const router = Router();
const loginController = new LoginController();
const validation = new TokenValidator();

router.post('/login', (req, res) => loginController.login(req, res));
router.get(
  '/login/role',
  (req, res, next) => validation.validateToken(req, res, next),
  (req, res) => loginController.getRole(req, res),
);

export default router;
