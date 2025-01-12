import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { CoreModule } from './modules/core/core.module';
import { HealthModule } from './modules/health/health.module';
import { HttpReqResLoggingMiddleware } from './common/middleware/http-req-res-logging.middleware';

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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpReqResLoggingMiddleware).forRoutes('*'); // Apply the middleware to all routes
  }
}
