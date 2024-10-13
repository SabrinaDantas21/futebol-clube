import { Team } from '../database/models/TeamsModel';

const getAllTeams = async () => {
  const teams = await Team.findAll();
  return teams;
};

const getTeamById = async (id: number) => {
  const team = await Team.findByPk(id);
  return team;
};

export default { getAllTeams, getTeamById };
