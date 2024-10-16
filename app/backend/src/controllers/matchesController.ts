import { Request, Response } from 'express';
import MatchesService from '../services/matchesService';

class MatchesController {
  private matchesService = new MatchesService();

  public async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const matches = await this.matchesService.getAllMatches();
      console.log(matches, 'logcontroller');

      return res.status(200).json(matches);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default MatchesController;
