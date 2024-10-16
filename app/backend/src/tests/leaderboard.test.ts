import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import LeaderboardService from '../services/leaderboardService';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /leaderboard', () => {
  describe('GET /leaderboard/home', () => {
    let calculateHomeLeaderboardStub: sinon.SinonStub;

    beforeEach(() => {
      calculateHomeLeaderboardStub = sinon.stub(LeaderboardService, 'calculateHomeLeaderboard');
    });

    afterEach(() => {
      calculateHomeLeaderboardStub.restore();
    });

    it('deve retornar 200 e a leaderboard em formato correto', async () => {
      const mockLeaderboard = [
        {
          teamName: 'Team A',
          totalPoints: 10,
          totalGames: 5,
          totalVictories: 3,
          totalDraws: 1,
          totalLosses: 1,
          goalsFavor: 12,
          goalsOwn: 8,
          goalsBalance: 4,
        },
        {
          teamName: 'Team B',
          totalPoints: 8,
          totalGames: 5,
          totalVictories: 2,
          totalDraws: 2,
          totalLosses: 1,
          goalsFavor: 10,
          goalsOwn: 6,
          goalsBalance: 4,
        },
      ];

      calculateHomeLeaderboardStub.resolves({ data: mockLeaderboard });

      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
      expect(response.body[0]).to.include.keys('teamName', 'totalPoints', 'totalGames', 'totalVictories', 'totalDraws', 'totalLosses', 'goalsFavor', 'goalsOwn', 'goalsBalance');
    });

    it('deve retornar 500 se ocorrer um erro no serviço', async () => {
      calculateHomeLeaderboardStub.rejects(new Error('Erro interno do servidor'));

      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ status: 'error', message: 'Erro interno do servidor' });
    });

    it('deve retornar 200 e uma leaderboard vazia se não houver partidas', async () => {
      calculateHomeLeaderboardStub.resolves({ data: [] });

      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(0);
    });

    it('deve calcular corretamente a leaderboard com dados variados', async () => {
      const mockLeaderboard = [
        {
          teamName: 'Team C',
          totalPoints: 15,
          totalGames: 6,
          totalVictories: 5,
          totalDraws: 0,
          totalLosses: 1,
          goalsFavor: 20,
          goalsOwn: 10,
          goalsBalance: 10,
        },
        {
          teamName: 'Team D',
          totalPoints: 9,
          totalGames: 6,
          totalVictories: 2,
          totalDraws: 3,
          totalLosses: 1,
          goalsFavor: 15,
          goalsOwn: 12,
          goalsBalance: 3,
        },
      ];

      calculateHomeLeaderboardStub.resolves({ data: mockLeaderboard });

      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.include.keys('teamName', 'totalPoints', 'totalGames', 'totalVictories', 'totalDraws', 'totalLosses', 'goalsFavor', 'goalsOwn', 'goalsBalance');
      expect(response.body[0].teamName).to.equal('Team C');
      expect(response.body[1].teamName).to.equal('Team D');
    });

    it('deve manter a estrutura correta da resposta mesmo sem times', async () => {
      calculateHomeLeaderboardStub.resolves({ data: [] });

      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(0);
    });
  });

  describe('GET /leaderboard/away', () => {
    let calculateAwayLeaderboardStub: sinon.SinonStub;

    beforeEach(() => {
      calculateAwayLeaderboardStub = sinon.stub(LeaderboardService, 'calculateAwayLeaderboard');
    });

    afterEach(() => {
      calculateAwayLeaderboardStub.restore();
    });

    it('deve retornar 200 e a away leaderboard em formato correto', async () => {
      const mockLeaderboard = [
        {
          teamName: 'Team E',
          totalPoints: 12,
          totalGames: 5,
          totalVictories: 4,
          totalDraws: 0,
          totalLosses: 1,
          goalsFavor: 15,
          goalsOwn: 5,
          goalsBalance: 10,
        },
        {
          teamName: 'Team F',
          totalPoints: 9,
          totalGames: 5,
          totalVictories: 3,
          totalDraws: 0,
          totalLosses: 2,
          goalsFavor: 10,
          goalsOwn: 8,
          goalsBalance: 2,
        },
      ];

      calculateAwayLeaderboardStub.resolves({ data: mockLeaderboard });

      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(2);
      expect(response.body[0]).to.include.keys('teamName', 'totalPoints', 'totalGames', 'totalVictories', 'totalDraws', 'totalLosses', 'goalsFavor', 'goalsOwn', 'goalsBalance');
    });

    it('deve retornar 500 se ocorrer um erro no serviço', async () => {
      calculateAwayLeaderboardStub.rejects(new Error('Erro interno do servidor'));

      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ status: 'error', message: 'Erro interno do servidor' });
    });

    it('deve retornar 200 e uma away leaderboard vazia se não houver partidas', async () => {
      calculateAwayLeaderboardStub.resolves({ data: [] });

      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(0);
    });

    it('deve calcular corretamente a away leaderboard com dados variados', async () => {
      const mockLeaderboard = [
        {
          teamName: 'Team G',
          totalPoints: 15,
          totalGames: 6,
          totalVictories: 5,
          totalDraws: 1,
          totalLosses: 0,
          goalsFavor: 25,
          goalsOwn: 10,
          goalsBalance: 15,
        },
        {
          teamName: 'Team H',
          totalPoints: 10,
          totalGames: 6,
          totalVictories: 3,
          totalDraws: 1,
          totalLosses: 2,
          goalsFavor: 18,
          goalsOwn: 15,
          goalsBalance: 3,
        },
      ];

      calculateAwayLeaderboardStub.resolves({ data: mockLeaderboard });

      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body[0]).to.include.keys('teamName', 'totalPoints', 'totalGames', 'totalVictories', 'totalDraws', 'totalLosses', 'goalsFavor', 'goalsOwn', 'goalsBalance');
      expect(response.body[0].teamName).to.equal('Team G');
      expect(response.body[1].teamName).to.equal('Team H');
    });

    it('deve manter a estrutura correta da resposta mesmo sem times', async () => {
      calculateAwayLeaderboardStub.resolves({ data: [] });

      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(0);
    });
  });
});
