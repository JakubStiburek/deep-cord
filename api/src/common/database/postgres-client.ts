import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as postgres from 'postgres';

@Injectable()
export class PostgresClient {
  constructor(private configService: ConfigService) {}

  private PG_HOST = this.configService.get<string>('PGHOST');
  private PG_DATABASE = this.configService.get<string>('PGDATABASE');
  private PG_USER = this.configService.get<string>('PGUSER');
  private PG_PASSWORD = this.configService.get<string>('PGPASSWORD');

  private readonly URL = `postgres://username:password@host/database`;

  readonly sql = postgres(this.URL, {
    username: this.PG_USER,
    password: this.PG_PASSWORD,
    host: this.PG_HOST,
    database: this.PG_DATABASE,
    ssl: 'require',
  });
}
