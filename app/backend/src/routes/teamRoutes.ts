import { Router } from 'express';
import { getTeams, getTeamByIdHandler } from '../controllers/teamController';

const router = Router();

router.get('/teams', getTeams);
router.get('/teams/:id', getTeamByIdHandler);

export default router;
