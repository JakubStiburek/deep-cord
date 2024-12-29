import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as postgres from 'postgres';

@Injectable()
export class PostgresClient {
  constructor(private configService: ConfigService) {}

  private PG_HOST = this.configService.get<string>('PG_HOST');
  private PG_DATABASE = this.configService.get<string>('PG_DATABASE');
  private PG_USER = this.configService.get<string>('PG_USER');
  private PG_PASSWORD = this.configService.get<string>('PG_PASSWORD');
  private NODE_ENV = this.configService.get<string>('NODE_ENV');

  private readonly URL = `postgres://username:password@host/database`;

  readonly sql = postgres(this.URL, {
    username: this.PG_USER,
    password: this.PG_PASSWORD,
    host: this.PG_HOST,
    database: this.PG_DATABASE,
    ssl: this.NODE_ENV === 'local' ? undefined : 'require',
  });
}
