import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/TeamsModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('TeamController', () => {
  let findAllStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;

  beforeEach(() => {
    findAllStub = sinon.stub(Team, 'findAll').resolves([
      Team.build({ id: 1, teamName: 'Avaí/Kindermann' }),
      Team.build({ id: 2, teamName: 'Bahia' }),
    ]);

    findByPkStub = sinon.stub(Team, 'findByPk');
  });

  afterEach(() => {
    findAllStub.restore();
    findByPkStub.restore();
  });

  describe('GET /teams', () => {
    it('deve retornar todos os times com status 200', async () => {
      const response = await chai.request(app).get('/teams');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal([
        { id: 1, teamName: 'Avaí/Kindermann' },
        { id: 2, teamName: 'Bahia' },
      ]);
    });

    it('deve retornar um array vazio quando não houver times', async () => {
      findAllStub.resolves([]);

      const response = await chai.request(app).get('/teams');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal([]);
    });
  });

  describe('GET /teams/:id', () => {
    it('deve retornar um time específico com status 200', async () => {
      findByPkStub.resolves(Team.build({ id: 1, teamName: 'Avaí/Kindermann' }));

      const response = await chai.request(app).get('/teams/1');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({ id: 1, teamName: 'Avaí/Kindermann' });
    });

    it('deve retornar 404 quando o time não for encontrado', async () => {
      findByPkStub.resolves(null);

      const response = await chai.request(app).get('/teams/999');

      expect(response.status).to.equal(404);
      expect(response.body).to.deep.equal({ message: 'Team not found' });
    });

    it('deve retornar 500 quando ocorrer um erro no banco de dados ao buscar por ID', async () => {
      findByPkStub.rejects(new Error('Database error'));

      const response = await chai.request(app).get('/teams/1');

      expect(response.status).to.equal(500);
      expect(response.body).to.deep.equal({ message: 'Internal server error' });
    });
  });
});
