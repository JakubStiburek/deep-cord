import { Inject, Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { Sql } from 'postgres';

export interface Dog {
  name: string;
  type: string;
}

@Injectable()
export class NeonDBHealthIndicator extends HealthIndicator {
  constructor(
    @Inject('POSTGRES_CLIENT')
    private readonly sql: Sql,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const [result] = await this.sql`select 1;`;

      return this.getStatus(key, !!result);
    } catch (err) {
      throw new HealthCheckError('NeonDB health check failed', err);
    }
  }
}
