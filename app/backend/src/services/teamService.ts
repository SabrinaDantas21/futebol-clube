import { Team } from '../database/models/TeamsModel';

const getAllTeams = async () => {
  const teams = await Team.findAll();
  return teams;
};

export default getAllTeams;
