import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboardController';

const router = Router();
const leaderboardController = new LeaderboardController();

router.get(
  '/leaderboard/home',
  (req, res) => leaderboardController.getHomeLeaderboard(req, res),
);

export default router;
