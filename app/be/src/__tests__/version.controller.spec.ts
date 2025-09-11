import { Test, TestingModule } from '@nestjs/testing';
import { VersionController } from '../controllers/version.controller';
import { VersionService } from '../services/version.service';

describe('VersionController', () => {
  let controller: VersionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersionController],
      providers: [VersionService],
    }).compile();

    controller = module.get<VersionController>(VersionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the version from package.json', () => {
    const result = controller.getVersion();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const expectedVersion = require('../../package.json').version;
    expect(result).toEqual({ version: expectedVersion });
  });
});
