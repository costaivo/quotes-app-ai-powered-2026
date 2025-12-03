import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "dotenv";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { GlobalExceptionFilter } from "./common/filters/global-exception.filter";
import { AppModule } from "./app.module";

// Load .env from root directory if running locally
// Try multiple possible root paths
const possibleRootPaths = [
  path.join(process.cwd(), ".env"), // Current working directory
  path.join(process.cwd(), "../../.env"), // From app/be/
  path.join(process.cwd(), "../.env"), // From app/
];

let envLoaded = false;
for (const envPath of possibleRootPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`✓ Loading environment variables from: ${envPath}`);
    config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log(`⚠ Root .env file not found. Checked:`);
  for (const p of possibleRootPaths) {
    console.log(`  - ${p}`);
  }
  console.log(`  Using default environment variables (usually defaults to "db" for host)`);
}

// Log loaded environment variables in development mode
if (process.env.NODE_ENV === "development") {
  console.log(`\n📋 Loaded Environment Variables:`);
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ? "***" : undefined,
    DATABASE_URL: process.env.DATABASE_URL
      ? `${process.env.DATABASE_URL.split("@")[0].split("://")[0]}://***@${process.env.DATABASE_URL.split("@")[1]}`
      : undefined,
  };
  Object.entries(envVars).forEach(([key, value]) => {
    if (value !== undefined) {
      console.log(`  ${key}: ${value}`);
    }
  });
  console.log("");
}

import { WinstonModule } from "nest-winston";
import { winstonConfig } from "./common/logger/winston.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  // Set global API prefix
  app.setGlobalPrefix("api");

  // Register global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Register global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger configuration (only in development)
  if (process.env.NODE_ENV === "development") {
    // Read package.json for API metadata
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    const config = new DocumentBuilder()
      .setTitle("Quotes Application API")
      .setDescription(packageJson.description || "Backend API for the Quotes Application")
      .setVersion(packageJson.version || "0.0.1")
      .addTag("Version", "Application version information")
      .addTag("Health", "Health check endpoints")
      .addTag("App", "Application endpoints")
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  // Enable CORS
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
  if (process.env.NODE_ENV === "development") {
    console.log(`Swagger documentation: http://localhost:${port}/api/docs`);
  }
}
bootstrap();
