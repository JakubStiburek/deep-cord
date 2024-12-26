import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RecordController } from './record.controller';
import * as request from 'supertest';
import { Server } from 'http';

describe('RecordController', () => {
  const path = '/api/records';
  let app: INestApplication;
  let httpServer: Server;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordController],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  describe('POST api/transcripts', () => {
    it('should throw 404 when file is missing', async () => {
      return request(httpServer).post(path).expect(404);
    });
  });
});
