import { Request, Response } from 'express';
import MatchesService from '../services/matchesService';
import TeamsService from '../services/teamService';
import { Teams } from '../Interfaces/Teams';

class LeaderboardController {
  private matchesService = new MatchesService();
  private teamsService = new TeamsService();

  public async getHomeLeaderboard(req: Request, res: Response): Promise<Response> {
    const teams = await this.teamsService.getAllTeams();

    const leaderboard = await Promise.all(
      teams.map((team) => this.calculateTeamPerformance(team)),
    );

    return res.status(200).json(leaderboard);
  }

  private async calculateTeamPerformance(team: Teams) {
    const matches = await this.matchesService.getAllMatches();
    const homeMatches = matches.filter((match) => match.homeTeamId === team.id);

    const totalPoints = homeMatches.reduce((acc, match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) return acc + 3;
      if (match.homeTeamGoals === match.awayTeamGoals) return acc + 1;
      return acc;
    }, 0);

    return {
      name: team.teamName,
      totalPoints,
      totalGames: homeMatches.length,
      totalVictories: homeMatches
        .filter((match) => match.homeTeamGoals > match.awayTeamGoals).length,
      totalDraws: homeMatches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length,
      totalLosses: homeMatches.filter((match) => match.homeTeamGoals < match.awayTeamGoals).length,
      goalsFavor: homeMatches.reduce((acc, match) => acc + match.homeTeamGoals, 0),
      goalsOwn: homeMatches.reduce((acc, match) => acc + match.awayTeamGoals, 0),
    };
  }
}

export default LeaderboardController;
