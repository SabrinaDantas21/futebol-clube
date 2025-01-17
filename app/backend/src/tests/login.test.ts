import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as bcrypt from 'bcryptjs';

import { app } from '../app';
import User from '../database/models/UsersModel';

chai.use(chaiHttp);
const { expect } = chai;

describe('POST /login', () => {
  let findOneStub: sinon.SinonStub;
  let hashedPassword: string;

  beforeEach(() => {
    hashedPassword = bcrypt.hashSync('valid_password', 10);

    findOneStub = sinon.stub(User, 'findOne').resolves(User.build({
      id: 1,
      username: 'testUser',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
    }));
  });

  afterEach(() => {
    findOneStub.restore();
  });

  it('deve retornar 200 e um token válido quando o login for bem-sucedido', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'valid_password' });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });

  it('deve retornar 401 quando o email não estiver cadastrado', async () => {
    findOneStub.resolves(null);

    const response = await chai.request(app)
      .post('/login')
      .send({ email: 'notregistered@example.com', password: 'valid_password' });

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('deve retornar 401 quando a senha estiver incorreta', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: 'wrong_password' });

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('deve retornar 401 quando o formato do email for inválido', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({ email: 'invalid-email', password: 'valid_password' });

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('deve retornar 401 quando a senha tiver menos de 6 caracteres', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: '123' });

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  });

  it('deve retornar 400 quando o email estiver vazio', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({ email: '', password: 'valid_password' });

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('deve retornar 400 quando a senha estiver vazia', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({ email: 'test@example.com', password: '' });

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('deve retornar 400 quando o corpo da requisição estiver vazio', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({});

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('deve retornar 400 quando o email não for fornecido', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({ password: 'valid_password' });

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('deve retornar 400 quando a senha não for fornecida', async () => {
    const response = await chai.request(app)
      .post('/login')
      .send({ email: 'test@example.com' });

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
  });

  it('deve retornar 401 quando o email não seguir o padrão', async () => {
    findOneStub.resolves(null);
    const response = await chai.request(app)
      .post('/login')
      .send({ email: 'wrong_format_email', password: 'valid_password' });

    expect(response.status).to.equal(401);
    expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
  });

});
