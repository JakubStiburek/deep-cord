import * as fs from 'fs';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { FilesController } from './files.controller';

describe('(endpoint) FilesController', () => {
  const setupApp = async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: 'UPLOAD_DIRECTORY_PATH',
          useValue: './test/uploads',
        },
      ],
    }).compile();

    const app = moduleRef.createNestApplication();
    await app.init();

    return app;
  };

  afterAll(async () => {
    await fs.promises.rm('./test/uploads', { recursive: true });
  });

  it('should save file', async () => {
    const app = await setupApp();

    return request(app.getHttpServer())
      .post('/api/audio/records')
      .attach('file', './test/audio-sample.mp3')
      .expect(201);
  });

  it('should save file with correct path', async () => {
    const app = await setupApp();

    return request(app.getHttpServer())
      .post('/api/audio/records')
      .attach('file', './test/audio-sample.mp3')
      .expect(201)
      .then((res) => {
        expect(res.body).toStrictEqual({
          path: expect.stringContaining('./test/uploads/record-audio-sample'),
        });
      });
  });

  it('should save file with file extension', async () => {
    const app = await setupApp();

    return request(app.getHttpServer())
      .post('/api/audio/records')
      .attach('file', './test/audio-sample.mp3')
      .expect(201)
      .then((res) => {
        expect(res.body).toStrictEqual({
          path: expect.stringContaining('mp3'),
        });
      });
  });

  it('should save file with provided extension', async () => {
    const app = await setupApp();

    return request(app.getHttpServer())
      .post('/api/audio/records')
      .attach('file', './test/audio-sample.mp3')
      .query('extension=wav')
      .expect(201)
      .then((res) => {
        expect(res.body).toStrictEqual({
          path: expect.stringContaining('wav'),
        });
      });
  });

  it('should save file with default extension', async () => {
    const app = await setupApp();

    return request(app.getHttpServer())
      .post('/api/audio/records')
      .attach('file', './test/audio-sample-no-extension')
      .expect(201)
      .then((res) => {
        expect(res.body).toStrictEqual({
          path: expect.stringContaining('mp3'),
        });
      });
  });
});
