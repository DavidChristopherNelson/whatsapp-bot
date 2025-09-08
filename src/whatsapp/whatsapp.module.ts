import { Module } from '@nestjs/common';
import { WebhookController } from './controllers/webhook.controller';
import { WhatsappService } from './services/whatsapp.service';
import { MediaService } from './services/media.service';
import { ReplyService } from './services/reply.service';

@Module({
  imports: [],
  controllers: [WebhookController],
  providers: [WhatsappService, MediaService, ReplyService],
})
export class WhatsappModule {}


