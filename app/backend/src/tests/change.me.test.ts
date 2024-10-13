import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Team from '../database/models/TeamsModel';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /teams', () => {
  let findAllStub: sinon.SinonStub;

  before(() => {
    findAllStub = sinon.stub(Team, 'findAll').resolves([
      Team.build({ id: 1, teamName: 'Avaí/Kindermann' }),
      Team.build({ id: 2, teamName: 'Bahia' }),
    ]);
  });

  after(() => {
    findAllStub.restore();
  });

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
