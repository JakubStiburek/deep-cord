import * as fs from 'fs';
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { FilesController } from './files.controller';
import * as mock from 'mock-fs';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';

describe('(endpoint) FilesController', () => {
  const path = '/api/audio/records';
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: 'UPLOAD_DIRECTORY_PATH',
          useValue: './test/uploads',
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();

    mock({
      test: {
        'audio-sample.mp3': Buffer.from([]),
        'audio-sample-no-extension': Buffer.from([]),
        uploads: {},
      },
      node_modules: {
        '.pnpm': {
          'jest-runner@29.7.0': {
            node_modules: {
              'jest-worker': mock.load(
                'node_modules/.pnpm/jest-runner@29.7.0/node_modules/jest-worker',
              ),
            },
          },
        },
      },
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
      return request(httpServer)
        .post(path)
        .attach('file', './test/audio-sample.mp3')
        .expect(201);
    });

    it('should save file with correct path', async () => {
      return request(httpServer)
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
      return request(httpServer)
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
      return request(httpServer)
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
      return request(httpServer)
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
      return request(httpServer)
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

      return request(httpServer)
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
