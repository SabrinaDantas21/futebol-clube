import { Request, Response } from 'express';
import TeamService from '../services/teamService';

class TeamController {
  private teamService = new TeamService();

  public async getTeams(req: Request, res: Response): Promise<Response> {
    try {
      const teams = await this.teamService.getAllTeams();
      return res.status(200).json(teams);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async getTeamById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    try {
      const team = await this.teamService.getTeamById(Number(id));

      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      return res.status(200).json(team);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default TeamController;
