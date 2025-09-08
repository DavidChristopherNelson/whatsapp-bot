import { Injectable } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { ConfigService } from '@nestjs/config';
import { MinimalWebhookValue } from '../../common/dto/whatsapp-webhook.dto';
import { toE164India } from '../../common/utils/phone.util';

@Injectable()
export class ReplyService {
  constructor(private readonly whatsapp: WhatsappService, private readonly config: ConfigService) {}

  async route(value: MinimalWebhookValue): Promise<void> {
    const contactWaId = value.contacts?.[0]?.wa_id;
    const msg = value.messages?.[0];
    if (!contactWaId || !msg) return;

    if (msg.type === 'text') {
      const mediaId = this.config.get<string>('WA_PLEASE_VOICE_MEDIA_ID');
      if (!mediaId) return;
      const to = toE164India(contactWaId);
      await this.whatsapp.sendAudioByMediaId(to, mediaId);
    }
  }
}


