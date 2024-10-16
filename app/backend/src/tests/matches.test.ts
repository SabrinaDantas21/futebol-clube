import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Matches from '../database/models/matchesModel';
import Teams from '../database/models/TeamsModel';
import TokenValidator from '../middlewares/validateToken';

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /matches', () => {
  let createMatchStub: sinon.SinonStub;
  let validateTokenStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;

  beforeEach(() => {
    createMatchStub = sinon.stub(Matches, 'create');
    validateTokenStub = sinon.stub(TokenValidator.prototype, 'validateToken').callsFake((req, res, next) => {
      if (req.headers.authorization) {
        next();
      } else {
        res.status(401).json({ message: 'Token not found' });
      }
    });
    findByPkStub = sinon.stub(Teams, 'findByPk');
  });

  afterEach(() => {
    createMatchStub.restore();
    validateTokenStub.restore();
    findByPkStub.restore();
  });

  it('deve retornar 401 se o token não for fornecido', async () => {
    const response = await chai.request(app)
      .post('/matches')
      .send({
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamGoals: 1,
        awayTeamGoals: 0,
      });

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Token not found');
  });

  it('deve retornar 400 se os campos obrigatórios não forem fornecidos', async () => {
    const token = 'token_valido_aqui';

    const response = await chai.request(app)
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send({
        homeTeamId: 1,
        awayTeamGoals: 1,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('All fields are required');
  });

  it('deve criar uma nova partida e retornar 201', async () => {
    createMatchStub.resolves({
      id: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      homeTeamGoals: 1,
      awayTeamGoals: 0,
      inProgress: true,
    });

    findByPkStub.withArgs(1).resolves({ id: 1 }); 
    findByPkStub.withArgs(2).resolves({ id: 2 }); 
    const token = 'token_valido_aqui';

    const response = await chai.request(app)
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send({
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamGoals: 1,
        awayTeamGoals: 0,
      });

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('id');
    expect(response.body.homeTeamId).to.equal(1);
    expect(response.body.awayTeamId).to.equal(2);
    expect(response.body.homeTeamGoals).to.equal(1);
    expect(response.body.awayTeamGoals).to.equal(0);
    expect(response.body.inProgress).to.equal(true);
  });

  it('deve retornar 422 se os times forem iguais', async () => {
    const token = 'token_valido_aqui';

    const response = await chai.request(app)
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send({
        homeTeamId: 1,
        awayTeamId: 1, 
        homeTeamGoals: 1,
        awayTeamGoals: 0,
      });

    expect(response.status).to.equal(422);
    expect(response.body.message).to.equal('It is not possible to create a match with two equal teams');
  });

  it('deve retornar 404 se um time não existir', async () => {
    const token = 'token_valido_aqui';

    findByPkStub.withArgs(1).resolves({ id: 1 });
    findByPkStub.withArgs(2).resolves(null); 
    const response = await chai.request(app)
      .post('/matches')
      .set('Authorization', `Bearer ${token}`)
      .send({
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamGoals: 1,
        awayTeamGoals: 0,
      });

    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal('There is no team with such id!');
  });

  it('deve retornar 401 se o token for inválido', async () => {
    validateTokenStub.callsFake((req, res, next) => {
      res.status(401).json({ message: 'Token must be a valid token' });
    });

    const response = await chai.request(app)
      .post('/matches')
      .set('Authorization', `Bearer invalid_token`)
      .send({
        homeTeamId: 1,
        awayTeamId: 2,
        homeTeamGoals: 1,
        awayTeamGoals: 0,
      });

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Token must be a valid token');
  });
});
