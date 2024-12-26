import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './common/config/configuration';
import { AudioModule } from './modules/audio/audio.module';
import { TranscriptModule } from './modules/transcript/transcript.module';
import { RecordModule } from './modules/record/record.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    AudioModule,
    TranscriptModule,
    RecordModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
