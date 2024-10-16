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

  public static async calculateAwayLeaderboard() {
    const teams = await Teams.findAll();
    const matches = await Matches.findAll({ where: { inProgress: false } });

    const response = teams.map((team) => {
      const awayMatches = matches.filter((match) => match.awayTeamId === team.id);
      return this.createTeamStats(team.teamName, awayMatches, false);
    });

    const sortedResponse = this.sortLeaderboard(response);

    return { status: 'successful', data: sortedResponse };
  }

  private static createTeamStats(teamName: string, matches: Matches[], isHome = true) {
    const {
      totalPoints, totalVictories, totalDraws, totalLosses, goalsFavor, goalsOwn,
    } = this.calculateMatchStats(matches, isHome);

    const goalsBalance = goalsFavor - goalsOwn;
    const efficiency = this.calculateEfficiency(totalPoints, matches.length);

    return {
      name: teamName,
      totalPoints,
      totalGames: matches.length,
      totalVictories,
      totalDraws,
      totalLosses,
      goalsFavor,
      goalsOwn,
      goalsBalance,
      efficiency,
    };
  }

  private static calculateMatchStats(matches: Matches[], isHome: boolean) {
    return {
      totalPoints: this.calculateTotalPoints(matches, isHome),
      totalVictories: this.countVictories(matches, isHome),
      totalDraws: this.countDraws(matches),
      totalLosses: this.countLosses(matches, isHome),
      goalsFavor: this.calculateGoalsFavor(matches, isHome),
      goalsOwn: this.calculateGoalsOwn(matches, isHome),
    };
  }

  private static calculateGoalsFavor(matches: Matches[], isHome: boolean): number {
    return matches.reduce((
      acc,
      match,
    ) => acc + (isHome ? match.homeTeamGoals : match.awayTeamGoals), 0);
  }

  private static calculateGoalsOwn(matches: Matches[], isHome: boolean): number {
    return matches.reduce((
      acc,
      match,
    ) => acc + (isHome ? match.awayTeamGoals : match.homeTeamGoals), 0);
  }

  private static calculateTotalPoints(matches: Matches[], isHome: boolean): number {
    return matches.reduce((acc, match) => {
      const teamGoals = isHome ? match.homeTeamGoals : match.awayTeamGoals;
      const opponentGoals = isHome ? match.awayTeamGoals : match.homeTeamGoals;
      if (teamGoals > opponentGoals) return acc + 3;
      if (teamGoals === opponentGoals) return acc + 1;
      return acc;
    }, 0);
  }

  private static countVictories(matches: Matches[], isHome: boolean): number {
    return matches.filter((match) => {
      const teamGoals = isHome ? match.homeTeamGoals : match.awayTeamGoals;
      const opponentGoals = isHome ? match.awayTeamGoals : match.homeTeamGoals;
      return teamGoals > opponentGoals;
    }).length;
  }

  private static countDraws(matches: Matches[]): number {
    return matches.filter((match) => match.homeTeamGoals === match.awayTeamGoals).length;
  }

  private static countLosses(matches: Matches[], isHome: boolean): number {
    return matches.filter((match) => {
      const teamGoals = isHome ? match.homeTeamGoals : match.awayTeamGoals;
      const opponentGoals = isHome ? match.awayTeamGoals : match.homeTeamGoals;
      return teamGoals < opponentGoals;
    }).length;
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
