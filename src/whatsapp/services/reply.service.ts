import { Injectable } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { MinimalWebhookValue } from '../../common/dto/whatsapp-webhook.dto';

@Injectable()
export class ReplyService {
  constructor(private readonly whatsapp: WhatsappService) {}

  async handleIncoming(value: MinimalWebhookValue): Promise<void> {
    const message = value.messages?.[0];
    const waId = value.contacts?.[0]?.wa_id;
    if (!message || !waId) return;

    if (message.type === 'text') {
      const mediaId = process.env.WA_PLEASE_VOICE_MEDIA_ID as string | undefined;
      if (mediaId) {
        await this.whatsapp.sendAudioByMediaId(waId, mediaId);
      }
      return;
    }
  }
}


