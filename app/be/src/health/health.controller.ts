import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
// biome-ignore lint/style/useImportType: HealthService needed for DI
import { HealthService } from "./health.service";
import type { HealthStatus } from "./health.service";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Health check endpoint",
    description: "Returns the health status of the application, database, and system resources",
  })
  @ApiResponse({
    status: 200,
    description: "Health status retrieved successfully",
    schema: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["healthy", "unhealthy"] },
        timestamp: { type: "string", format: "date-time" },
        uptime: { type: "number", description: "Uptime in seconds" },
        checks: {
          type: "object",
          properties: {
            database: {
              type: "object",
              properties: {
                status: { type: "string", enum: ["healthy", "unhealthy"] },
                message: { type: "string" },
              },
            },
            application: {
              type: "object",
              properties: {
                status: { type: "string", enum: ["healthy", "unhealthy"] },
                message: { type: "string" },
              },
            },
            memory: {
              type: "object",
              properties: {
                status: { type: "string", enum: ["healthy", "unhealthy"] },
                used: { type: "number", description: "Used memory in MB" },
                total: { type: "number", description: "Total memory in MB" },
                percentage: { type: "number", description: "Memory usage percentage" },
              },
            },
          },
        },
      },
    },
  })
  async getHealth(): Promise<HealthStatus> {
    return this.healthService.getHealthStatus();
  }
}
