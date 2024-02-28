import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SMTPServiceModule } from './smtpService/smtpService.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),SMTPServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
