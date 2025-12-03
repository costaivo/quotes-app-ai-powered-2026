import { Test, type TestingModule } from '@nestjs/testing';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';

describe('VersionController', () => {
  let controller: VersionController;
  let service: VersionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersionController],
      providers: [VersionService],
    }).compile();

    controller = module.get<VersionController>(VersionController);
    service = module.get<VersionService>(VersionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return version information', () => {
    const result = controller.getVersion();
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('version');
    expect(result).toHaveProperty('description');
  });

  it('should call service getVersion method', () => {
    const spy = jest.spyOn(service, 'getVersion');
    controller.getVersion();
    expect(spy).toHaveBeenCalled();
  });
});
