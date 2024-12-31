import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { FilesController } from './files.controller';
import * as mock from 'mock-fs';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import { AudioFileOrchestrator } from '../../application/audio-file-orchestrator';
import { DateTime } from 'luxon';
import { Left, Right } from 'purify-ts';
import { AudioFile } from '../../model/entity/audio-file.entity';
import { NotUniqueException } from '../../model/exception/not-unique.exception';
import { UncaughtException } from '../../model/exception/uncaught.exception';

describe('(endpoint) FilesController', () => {
  const path = '/api/audio/files';
  let app: INestApplication;
  let httpServer: Server;
  let audioFileOrchestrator: AudioFileOrchestrator;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FilesController],
    })
      .useMocker((token) => {
        if (token === AudioFileOrchestrator) {
          return {
            add: jest.fn(),
            getAll: jest.fn(),
          };
        }
      })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
    audioFileOrchestrator = app.get<AudioFileOrchestrator>(
      AudioFileOrchestrator,
    );

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

  describe('POST api/audio/files', () => {
    it('should save file', async () => {
      jest
        .spyOn(audioFileOrchestrator, 'add')
        .mockResolvedValueOnce(
          Right(new AudioFile('id', 'name', 'uri', DateTime.now())),
        );

      return request(httpServer)
        .post(path)
        .attach('file', './test/audio-sample.mp3')
        .expect(201);
    });

    it('should return 409 on conflict', () => {
      jest
        .spyOn(audioFileOrchestrator, 'add')
        .mockResolvedValueOnce(Left(new NotUniqueException()));

      return request(httpServer)
        .post(path)
        .attach('file', './test/audio-sample.mp3')
        .expect(409);
    });

    it('should return 500 on other exception', () => {
      jest
        .spyOn(audioFileOrchestrator, 'add')
        .mockResolvedValueOnce(Left(new UncaughtException(new Error())));

      return request(httpServer)
        .post(path)
        .attach('file', './test/audio-sample.mp3')
        .expect(500);
    });

    it('should return 500 on any exception', () => {
      jest.spyOn(audioFileOrchestrator, 'add').mockImplementationOnce(() => {
        throw new Error();
      });

      return request(httpServer)
        .post(path)
        .attach('file', './test/audio-sample.mp3')
        .expect(500);
    });
  });

  describe('GET api/audio/files', () => {
    it('should return empty array if no files are found', async () => {
      jest
        .spyOn(audioFileOrchestrator, 'getAll')
        .mockResolvedValueOnce(Right([]));

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
      jest
        .spyOn(audioFileOrchestrator, 'getAll')
        .mockResolvedValueOnce(
          Right([new AudioFile('id', 'audio-sample', 'uri', DateTime.now())]),
        );

      return request(httpServer)
        .get(path)
        .expect(200)
        .then((res) => {
          expect(res.body).toStrictEqual({
            files: [
              {
                id: expect.any(String),
                name: 'audio-sample',
                uri: expect.any(String),
                createdAt: expect.any(String),
              },
            ],
          });
        });
    });

    it('should return 500 on other exception', () => {
      jest
        .spyOn(audioFileOrchestrator, 'getAll')
        .mockResolvedValueOnce(Left(new UncaughtException(new Error())));

      return request(httpServer).get(path).expect(500);
    });

    it('should return 500 on any exception', () => {
      jest.spyOn(audioFileOrchestrator, 'getAll').mockImplementationOnce(() => {
        throw new Error();
      });

      return request(httpServer).get(path).expect(500);
    });
  });
});
