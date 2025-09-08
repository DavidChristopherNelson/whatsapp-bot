import { Module } from '@nestjs/common';
import { WebhookController } from './controllers/webhook.controller';
import { WhatsappService } from './services/whatsapp.service';
import { MediaService } from './services/media.service';
import { ReplyService } from './services/reply.service';
import { SignatureGuard } from '../common/guards/signature.guard';

@Module({
  imports: [],
  controllers: [WebhookController],
  providers: [WhatsappService, MediaService, ReplyService, SignatureGuard],
})
export class WhatsappModule {}


