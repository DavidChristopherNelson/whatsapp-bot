import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class WhatsappService {
  constructor(private readonly config: ConfigService) {}

  async uploadMedia(file: Buffer, mime: string): Promise<string> {
    const baseUrl = 'https://graph.facebook.com';
    const version = this.config.get<string>('WA_API_VERSION') as string;
    const phoneId = this.config.get<string>('WA_PHONE_NUMBER_ID') as string;
    const token = this.config.get<string>('WA_ACCESS_TOKEN') as string;

    const url = `${baseUrl}/${version}/${phoneId}/media`;
    const form = new FormData();
    form.append('file', file, { filename: 'upload', contentType: mime });
    form.append('messaging_product', 'whatsapp');
    form.append('type', mime);

    const headers = {
      ...form.getHeaders(),
      Authorization: `Bearer ${token}`,
    } as Record<string, string>;

    const res = await axios.post(url, form, { headers });
    return res.data?.id as string;
  }

  async sendAudioByMediaId(toWaId: string, mediaId: string): Promise<void> {
    const baseUrl = 'https://graph.facebook.com';
    const version = this.config.get<string>('WA_API_VERSION') as string;
    const phoneId = this.config.get<string>('WA_PHONE_NUMBER_ID') as string;
    const token = this.config.get<string>('WA_ACCESS_TOKEN') as string;

    const url = `${baseUrl}/${version}/${phoneId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      to: toWaId,
      recipient_type: 'individual',
      type: 'audio',
      audio: { id: mediaId },
    };
    try {
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
    } catch (err: any) {
      const details = err?.response?.data ?? err?.message ?? String(err);
      throw new Error(`sendAudioByMediaId failed: ${JSON.stringify(details)}`);
    }
  }

  async getMediaUrl(mediaId: string): Promise<string> {
    const baseUrl = 'https://graph.facebook.com';
    const version = this.config.get<string>('WA_API_VERSION') as string;
    const token = this.config.get<string>('WA_ACCESS_TOKEN') as string;
    const url = `${baseUrl}/${version}/${mediaId}`;
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data?.url as string;
  }

  async downloadMedia(url: string): Promise<Buffer> {
    const token = this.config.get<string>('WA_ACCESS_TOKEN') as string;
    const res = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: { Authorization: `Bearer ${token}` },
    });
    return Buffer.from(res.data);
  }
}


