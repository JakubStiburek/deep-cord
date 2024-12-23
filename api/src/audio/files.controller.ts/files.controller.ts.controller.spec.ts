import { Test, TestingModule } from '@nestjs/testing';
import { FilesControllerTsController } from './files.controller.ts.controller';

describe('FilesControllerTsController', () => {
  let controller: FilesControllerTsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesControllerTsController],
    }).compile();

    controller = module.get<FilesControllerTsController>(FilesControllerTsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
