import { Router } from 'express';
import getTeams from '../controllers/teamController';

const router = Router();

router.get('/teams', getTeams);

export default router;
