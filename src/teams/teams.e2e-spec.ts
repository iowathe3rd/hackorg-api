import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';

describe('TeamsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/teams (GET)', () => {
    return request(app.getHttpServer())
      .get('/teams')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('/teams/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/teams/team-id')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('/teams (POST)', () => {
    const createTeamDto = { name: 'New Team', description: 'New team description' };
    return request(app.getHttpServer())
      .post('/teams')
      .send(createTeamDto)
      .expect(201)
      .expect('Content-Type', /json/);
  });

  it('/teams/:id (PATCH)', () => {
    const updateTeamDto = { description: 'Updated description' };
    return request(app.getHttpServer())
      .patch('/teams/team-id')
      .send(updateTeamDto)
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('/teams/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/teams/team-id')
      .expect(200);
  });

  it('/teams/:id/members (POST)', () => {
    return request(app.getHttpServer())
      .post('/teams/team-id/members')
      .send({ userId: 'user-id', role: 'MEMBER' })
      .expect(201)
      .expect('Content-Type', /json/);
  });

  it('/teams/:id/members/:userId (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/teams/team-id/members/user-id')
      .expect(200);
  });

  it('/teams/:id/members (GET)', () => {
    return request(app.getHttpServer())
      .get('/teams/team-id/members')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  afterAll(async () => {
    await app.close();
  });
});
