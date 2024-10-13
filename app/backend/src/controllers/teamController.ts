import { Request, Response } from 'express';
import getAllTeams from '../services/teamService';

const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await getAllTeams();
    return res.status(200).json(teams);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default getTeams;
