import { Request, Response } from 'express';
import MatchesService from '../services/matchesService';

class MatchesController {
  private matchesService = new MatchesService();

  private async handleRequest(
    req: Request,
    res: Response,
    action: (req: Request) => Promise<Response>,
  ): Promise<Response> {
    try {
      return await action.call(this, req);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async getAll(req: Request, res: Response): Promise<Response> {
    return this.handleRequest(req, res, async (request) => {
      const { inProgress } = request.query;

      if (inProgress !== undefined) {
        const isProgress = inProgress === 'true';
        const filteredMatches = await this.matchesService.getByProgress(isProgress);
        return res.status(200).json(filteredMatches);
      }

      const matches = await this.matchesService.getAllMatches();
      return res.status(200).json(matches);
    });
  }

  public async finishMatch(req: Request, res: Response): Promise<Response> {
    return this.handleRequest(req, res, async (request) => {
      const { id } = request.params;
      await this.matchesService.finishMatch(Number(id));
      return res.status(200).json({ message: 'Finished' });
    });
  }

  public async updateMatch(req: Request, res: Response): Promise<Response> {
    return this.handleRequest(req, res, async (request) => {
      const { id } = request.params;
      const { homeTeamGoals, awayTeamGoals } = request.body;

      if (homeTeamGoals === undefined || awayTeamGoals === undefined) {
        return res.status(400)
          .json({ message: 'Both homeTeamGoals and awayTeamGoals are required' });
      }

      await this.matchesService.updateMatch(Number(id), homeTeamGoals, awayTeamGoals);
      return res.status(200).json({});
    });
  }

  public async createMatch(req: Request, res: Response): Promise<Response> {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;

    if (!homeTeamId || !awayTeamId || homeTeamGoals === undefined || awayTeamGoals === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (homeTeamId === awayTeamId) {
      return res.status(422)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }

    const homeTeamExists = await this.matchesService.checkTeamExists(homeTeamId);
    const awayTeamExists = await this.matchesService.checkTeamExists(awayTeamId);

    if (!homeTeamExists || !awayTeamExists) {
      return res.status(404).json({ message: 'There is no team with such id!' });
    }

    const newMatch = await this.matchesService.createMatch(req.body);
    return res.status(201).json(newMatch);
  }
}

export default MatchesController;
