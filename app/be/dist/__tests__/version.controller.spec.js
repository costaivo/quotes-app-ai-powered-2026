"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const version_controller_1 = require("../controllers/version.controller");
const version_service_1 = require("../services/version.service");
describe('VersionController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [version_controller_1.VersionController],
            providers: [version_service_1.VersionService],
        }).compile();
        controller = module.get(version_controller_1.VersionController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    it('should return the version from package.json', () => {
        const result = controller.getVersion();
        const expectedVersion = require('../../package.json').version;
        expect(result).toEqual({ version: expectedVersion });
    });
});
//# sourceMappingURL=version.controller.spec.js.map