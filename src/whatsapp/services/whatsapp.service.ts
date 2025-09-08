import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsappService {
  private readonly http: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.http = axios.create({ baseURL: this.getGraphBaseUrl() });
  }

  async uploadMedia(file: Buffer, mime: string): Promise<string> {
    const phoneId = this.getPhoneNumberId();
    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    form.append('file', file, { filename: 'upload', contentType: mime });
    const headers = { ...this.getAuthHeader(), ...form.getHeaders() };
    const { data } = await this.http.post(`/${phoneId}/media`, form, { headers });
    return data.id as string;
  }

  async sendAudioByMediaId(toWaId: string, mediaId: string): Promise<void> {
    const phoneId = this.getPhoneNumberId();
    const payload = {
      messaging_product: 'whatsapp',
      to: toWaId,
      type: 'audio',
      audio: { id: mediaId },
    };
    await this.http.post(`/${phoneId}/messages`, payload, { headers: this.getAuthHeader() });
  }

  async getMediaUrl(mediaId: string): Promise<string> {
    const { data } = await this.http.get(`/${mediaId}`, { headers: this.getAuthHeader() });
    return data.url as string;
  }

  async downloadMedia(url: string): Promise<Buffer> {
    const { data } = await this.http.get(url, {
      headers: this.getAuthHeader(),
      responseType: 'arraybuffer',
    });
    return Buffer.from(data);
  }

  private getGraphBaseUrl(): string {
    const version = this.config.get<string>('WA_API_VERSION');
    return `https://graph.facebook.com/${version}`;
  }

  private getPhoneNumberId(): string {
    const id = this.config.get<string>('WA_PHONE_NUMBER_ID');
    if (!id) throw new Error('WA_PHONE_NUMBER_ID not set');
    return id;
  }

  private getAuthHeader(): Record<string, string> {
    const token = this.config.get<string>('WA_ACCESS_TOKEN');
    if (!token) throw new Error('WA_ACCESS_TOKEN not set');
    return { Authorization: `Bearer ${token}` };
  }
}


