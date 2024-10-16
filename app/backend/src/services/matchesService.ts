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
    console.log(matches, 'log do service martches');
    return matches;
  }
}

export default MatchesService;
