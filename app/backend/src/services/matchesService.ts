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

  public async finishMatch(id: number): Promise<void> {
    await this.matchesModel.update(
      { inProgress: false },
      { where: { id } },
    );
  }

  public async updateMatch(id: number, homeTeamGoals: number, awayTeamGoals: number) {
    const match = await this.matchesModel.findByPk(id);

    if (!match) {
      throw new Error('Match not found');
    }

    match.homeTeamGoals = homeTeamGoals;
    match.awayTeamGoals = awayTeamGoals;
    await match.save();

    return match;
  }

  public async createMatch(matchData: {
    homeTeamId: number;
    awayTeamId: number;
    homeTeamGoals: number;
    awayTeamGoals: number;
  }) {
    const newMatch = await this.matchesModel.create({
      ...matchData,
      inProgress: true,
    });

    return newMatch;
  }
}

export default MatchesService;
