import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';
import { WhatsappService } from '../src/whatsapp/services/whatsapp.service';

jest.mock('axios');

describe('WhatsappService', () => {
  const mockConfig = {
    get: (key: string) => {
      const map: Record<string, string> = {
        WA_API_VERSION: 'v20.0',
        WA_PHONE_NUMBER_ID: '12345',
        WA_ACCESS_TOKEN: 'token',
      };
      return map[key];
    },
  } as unknown as ConfigService;

  const service = new WhatsappService(mockConfig);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uploadMedia posts to /{PHONE_NUMBER_ID}/media with multipart/form-data', async () => {
    const postMock = axios.post as jest.Mock;
    postMock.mockResolvedValue({ data: { id: 'media123' } });
    const buf = Buffer.from('abc');
    const id = await service.uploadMedia(buf, 'audio/ogg');
    expect(id).toBe('media123');
    const [[url, body, opts]] = postMock.mock.calls;
    expect(url).toBe('https://graph.facebook.com/v20.0/12345/media');
    expect(opts.headers.Authorization).toBe('Bearer token');
    expect(body).toBeInstanceOf(FormData);
  });

  it('sendAudioByMediaId posts correct JSON payload to /messages', async () => {
    const postMock = axios.post as jest.Mock;
    postMock.mockResolvedValue({ data: {} });
    await service.sendAudioByMediaId('987', 'media123');
    const [[url, payload, opts]] = postMock.mock.calls;
    expect(url).toBe('https://graph.facebook.com/v20.0/12345/messages');
    expect(payload).toEqual({
      messaging_product: 'whatsapp',
      to: '987',
      type: 'audio',
      audio: { id: 'media123' },
    });
    expect(opts.headers.Authorization).toBe('Bearer token');
  });
});


