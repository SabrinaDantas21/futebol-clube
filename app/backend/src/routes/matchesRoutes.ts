import { Router } from 'express';
import MatchesController from '../controllers/matchesController';

const router = Router();
const matchesController = new MatchesController();

router.get(
  '/matches',
  (req, res) => matchesController.getAll(req, res),
);

export default router;
