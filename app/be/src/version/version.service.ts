import * as fs from "node:fs";
import * as path from "node:path";
import { Injectable } from "@nestjs/common";

export interface VersionInfo {
  name: string;
  version: string;
  description: string;
}

@Injectable()
export class VersionService {
  private packageJsonPath: string;

  constructor() {
    this.packageJsonPath = path.join(process.cwd(), "package.json");
  }

  getVersion(): VersionInfo {
    try {
      const packageJsonContent = fs.readFileSync(this.packageJsonPath, "utf-8");
      const packageJson = JSON.parse(packageJsonContent);

      return {
        name: "be-quotes-app",
        version: packageJson.version || "unknown",
        description: packageJson.description || "",
      };
    } catch (error) {
      throw new Error(
        `Failed to read package.json: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}
