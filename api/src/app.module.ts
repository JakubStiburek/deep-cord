import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { CoreModule } from './modules/core/core.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CoreModule,
    HealthModule,
  ],
  providers: [],
})
export class AppModule {}
