import { Request, Response } from 'express';
import MatchesService from '../services/matchesService';

class MatchesController {
  private matchesService = new MatchesService();

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const { inProgress } = req.query;

      if (inProgress !== undefined) {
        const isProgress = inProgress === 'true';
        const filteredMatches = await this.matchesService.getByProgress(isProgress);
        return res.status(200).json(filteredMatches);
      }

      const matches = await this.matchesService.getAllMatches();
      return res.status(200).json(matches);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async finishMatch(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      await this.matchesService.finishMatch(Number(id));

      return res.status(200).json({ message: 'Finished' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default MatchesController;
