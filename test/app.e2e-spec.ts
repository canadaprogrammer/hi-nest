import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  test('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('welcome to my Movie API');
  });

  describe('/movies', () => {
    test('GET', () => {
      return request(app.getHttpServer())
        .get('/movies')
        .expect(200)
        .expect([])
    });

    test('POST', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Movie',
          year: 2000,
          genres: ['Action'],
        })
        .expect(201);
    });

    test('DELETE', () => {
      return request(app.getHttpServer())
        .delete('/movies')
        .expect(404);
    });
  });

  describe('/movies/:id', () => {
    test('GET 200', () => {
      return request(app.getHttpServer())
      .get('/movies/1')
      .expect(200);
    });
    test('GET 404', () => {
      return request(app.getHttpServer())
      .get('/movies/999')
      .expect(404);
    });
    test.todo('DELETE');
    test.todo('PATCH');
  });
});
