import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  HealthCheck,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { NeonDBHealthIndicator } from './neon-db-health-indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private neonDB: NeonDBHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 500 * 1024 * 1024),
      () => this.neonDB.isHealthy('database'),
      () => this.http.pingCheck('Deepgram', 'https://status.deepgram.com/'),
      () => this.http.pingCheck('Neon', 'https://neonstatus.com/'),
    ]);
  }
}
