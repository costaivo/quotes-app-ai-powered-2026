import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class VersionService {
  private readonly version: string;

  constructor() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    this.version = packageJson.version;
  }

  getVersion() {
    return { version: this.version };
  }
}
