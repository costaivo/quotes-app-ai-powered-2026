import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import type { VersionInfo, VersionService } from "./version.service";

@ApiTags("Version")
@Controller("version")
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get()
  @ApiOperation({
    summary: "Get application version information",
    description: "Returns the application name, version, and description from package.json",
  })
  @ApiResponse({
    status: 200,
    description: "Version information retrieved successfully",
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "be" },
        version: { type: "string", example: "0.0.1" },
        description: { type: "string", example: "Backend application for Quotes App" },
      },
    },
  })
  getVersion(): VersionInfo {
    return this.versionService.getVersion();
  }
}
