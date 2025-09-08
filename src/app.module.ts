import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { BackendModule } from './backend/backend.module';

@Module({
  imports: [ConfigModule, WhatsappModule, SchedulerModule, BackendModule],
})
export class AppModule {}


