import { Team } from '../database/models/TeamsModel';

class TeamsService {
  private teamModel = Team;

  public async getAllTeams() {
    const teams = await this.teamModel.findAll();
    return teams;
  }

  public async getTeamById(id: number) {
    const team = await this.teamModel.findByPk(id);
    return team;
  }
}

export default TeamsService;
