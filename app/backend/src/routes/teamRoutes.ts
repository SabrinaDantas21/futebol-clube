import { Router } from 'express';
import TeamsController from '../controllers/teamController';

const router = Router();
const teamsController = new TeamsController();

router.get('/teams', (req, res) => teamsController.getTeams(req, res));
router.get('/teams/:id', (req, res) => teamsController.getTeamById(req, res));

export default router;
