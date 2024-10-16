import ILeaderBoard from '../Interfaces/Leaderboard';
import Teams from '../database/models/TeamsModel';
import Matches from '../database/models/matchesModel';

class LeaderboardService {
  public static async calculateHomeLeaderboard() {
    const teams = await Teams.findAll();
    const matches = await Matches.findAll({ where: { inProgress: false } });

    const response = teams.map((team) => {
      const homeMatches = matches.filter((match) => match.homeTeamId === team.id);
      return this.createTeamStats(team.teamName, homeMatches);
    });

    const sortedResponse = this.sortLeaderboard(response);

    return { status: 'successful', data: sortedResponse };
  }

  private static createTeamStats(teamName: string, homeMatches: Matches[]) {
    const { totalPoints, totalVictories,
      totalDraws, totalLosses, goalsFavor, goalsOwn } = this.calculateMatchStats(homeMatches);
    const goalsBalance = goalsFavor - goalsOwn;
    const efficiency = this.calculateEfficiency(totalPoints, homeMatches.length);

    return {
      name: teamName,
      totalPoints,
      totalGames: homeMatches.length,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    };
  }

  private static calculateMatchStats(matches: Matches[]) {
    return {
      totalPoints: this.calculateTotalPoints(matches),
      totalVictories: this.countVictories(matches),
      totalDraws: this.countDraws(matches),
      totalLosses: this.countLosses(matches),
      goalsFavor: this.calculateGoalsFavor(matches),
      goalsOwn: this.calculateGoalsOwn(matches),
    };
  }

  private static calculateGoalsFavor(matches: Matches[]): number {
    return matches.reduce((acc, match) => acc + match.homeTeamGoals, 0);
  }

  private static calculateGoalsOwn(matches: Matches[]): number {
    return matches.reduce((acc, match) => acc + match.awayTeamGoals, 0);
  }

  private static calculateTotalPoints(matches: Matches[]): number {
    return matches.reduce((acc, match) => {
      if (match.homeTeamGoals > match.awayTeamGoals) return acc + 3;
      if (match.homeTeamGoals === match.awayTeamGoals) return acc + 1;
      return acc;
    }, 0);
  }

  private static countVictories(matches: Matches[]): number {
    return matches.filter((match) => match.homeTeamGoals > match.awayTeamGoals).length;
  }

  private static countDraws(matches: Matches[]): number {
    return matches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length;
  }

  private static countLosses(matches: Matches[]): number {
    return matches.filter((match) => match.homeTeamGoals < match.awayTeamGoals).length;
  }

  private static calculateEfficiency(totalPoints: number, totalGames: number): number {
    return totalGames === 0 ? 0 : Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));
  }

  private static sortLeaderboard(leaderboard: ILeaderBoard[]) {
    return leaderboard.sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      if (b.totalVictories !== a.totalVictories) return b.totalVictories - a.totalVictories;
      if (b.goalsBalance !== a.goalsBalance) return b.goalsBalance - a.goalsBalance;
      return b.goalsFavor - a.goalsFavor;
    });
  }
}

export default LeaderboardService;
