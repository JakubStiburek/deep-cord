import * as fs from 'fs';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { FilesController } from './files.controller';
import * as mock from 'mock-fs';

describe('(endpoint) FilesController', () => {
  let app;
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
  const path = '/api/audio/records';
  beforeAll(async () => {
    app = await setupApp();

    mock({
      test: {
        'audio-sample.mp3': '',
        'audio-sample-no-extension': '',
        uploads: {},
      },
      node_modules: mock.load('node_modules'),
    });
  });

  afterAll(async () => {
    mock.restore();
    await app.close();
  });

  describe('POST api/audio/records', () => {
    afterAll(async () => {
      await fs.promises.rm('./test/uploads', { recursive: true });
    });

    it('should save file', async () => {
      return request(app.getHttpServer())
        .post(path)
        .attach('file', './test/audio-sample.mp3')
        .expect(201);
    });

    it('should save file with correct path', async () => {
      return request(app.getHttpServer())
        .post(path)
        .attach('file', './test/audio-sample.mp3')
        .expect(201)
        .then((res) => {
          expect(res.body).toStrictEqual({
            uri: expect.stringContaining('./test/uploads/record-audio-sample'),
          });
        });
    });

    it('should save file with file extension', async () => {
      return request(app.getHttpServer())
        .post(path)
        .attach('file', './test/audio-sample.mp3')
        .expect(201)
        .then((res) => {
          expect(res.body).toStrictEqual({
            uri: expect.stringContaining('mp3'),
          });
        });
    });

    it('should save file with provided extension', async () => {
      return request(app.getHttpServer())
        .post(path)
        .attach('file', './test/audio-sample.mp3')
        .query('extension=wav')
        .expect(201)
        .then((res) => {
          expect(res.body).toStrictEqual({
            uri: expect.stringContaining('wav'),
          });
        });
    });

    it('should save file with default extension', async () => {
      return request(app.getHttpServer())
        .post(path)
        .attach('file', './test/audio-sample-no-extension')
        .expect(201)
        .then((res) => {
          expect(res.body).toStrictEqual({
            uri: expect.stringContaining('mp3'),
          });
        });
    });
  });

  describe('GET api/audio/records', () => {
    it('should return empty array if no files are found', async () => {
      return request(app.getHttpServer())
        .get(path)
        .expect(200)
        .then((res) => {
          expect(res.body).toStrictEqual({
            files: [],
          });
        });
    });

    it('should return array of files', async () => {
      mock({
        test: {
          uploads: {
            'audio-sample.mp3': '',
          },
        },
        node_modules: mock.load('node_modules'),
      });

      return request(app.getHttpServer())
        .get(path)
        .expect(200)
        .then((res) => {
          expect(res.body).toStrictEqual({
            files: [
              {
                uri: expect.any(String),
              },
            ],
          });
        });
    });
  });
});
