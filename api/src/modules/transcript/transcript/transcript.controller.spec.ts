import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { TranscriptController } from './transcript.controller';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';

describe('TranscriptController', () => {
  const path = '/api/transcripts';
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranscriptController],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  describe('POST api/transcripts', () => {
    it('should throw 404 when file is missing', async () => {
      return request(httpServer)
        .post(path)
        .send({ uri: './test/uploads/record-audio-sample-2024-12-25' })
        .expect(404);
    });
  });
});
