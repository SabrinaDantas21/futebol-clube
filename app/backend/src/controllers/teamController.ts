import { Request, Response } from 'express';
import teamService from '../services/teamService';

const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await teamService.getAllTeams();
    return res.status(200).json(teams);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getTeamByIdHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const team = await teamService.getTeamById(Number(id));

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    return res.status(200).json(team);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export { getTeams, getTeamByIdHandler };
