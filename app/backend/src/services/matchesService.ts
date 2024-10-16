import Matches from '../database/models/matchesModel';
import Teams from '../database/models/TeamsModel';

class MatchesService {
  private matchesModel = Matches;

  public async getAllMatches() {
    const matches = await this.matchesModel.findAll({
      include: [
        { model: Teams, as: 'homeTeam', attributes: ['teamName'] },
        { model: Teams, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    return matches;
  }

  public async getByProgress(inProgress: boolean) {
    const matches = await this.matchesModel.findAll({
      where: { inProgress },
      include: [
        { model: Teams, as: 'homeTeam', attributes: ['teamName'] },
        { model: Teams, as: 'awayTeam', attributes: ['teamName'] },
      ],
    });
    return matches;
  }
}

export default MatchesService;
