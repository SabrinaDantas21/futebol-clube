import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboardService';

class LeaderboardController {
  public static async getHomeLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const leaderboard = await LeaderboardService.calculateHomeLeaderboard();
      res.status(200).json(leaderboard.data);
    } catch (error: unknown) {
      console.error('Error fetching home leaderboard:', error);
      if (error instanceof Error) {
        res.status(500).json({ status: 'error', message: error.message });
      } else {
        res.status(500).json({ status: 'error', message: 'An unexpected error occurred' });
      }
    }
  }
}

export default LeaderboardController;
