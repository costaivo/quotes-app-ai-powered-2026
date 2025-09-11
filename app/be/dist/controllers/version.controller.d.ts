import { VersionService } from '../services/version.service';
export declare class VersionController {
    private readonly versionService;
    constructor(versionService: VersionService);
    getVersion(): {
        version: string;
    };
}
