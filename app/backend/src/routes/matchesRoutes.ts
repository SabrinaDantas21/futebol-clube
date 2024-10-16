import { Router } from 'express';
import TokenValidator from '../middlewares/validateToken';
import MatchesController from '../controllers/matchesController';

const router = Router();
const matchesController = new MatchesController();
const validation = new TokenValidator();

router.get(
  '/matches',
  (req, res) => matchesController.getAll(req, res),
);
router.patch(
  '/matches/:id/finish',
  (req, res, next) => validation.validateToken(req, res, next),
  (req, res) => matchesController.finishMatch(req, res),
);
router.patch(
  '/matches/:id',
  (req, res, next) => validation.validateToken(req, res, next),
  (req, res) => matchesController.updateMatch(req, res),
);
router.post(
  '/matches',
  (req, res, next) => validation.validateToken(req, res, next),
  (req, res) => matchesController.createMatch(req, res),
);

export default router;
