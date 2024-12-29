import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { CoreModule } from './modules/core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    CoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
