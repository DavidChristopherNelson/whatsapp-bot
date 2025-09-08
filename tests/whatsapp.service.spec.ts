import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { WhatsappService } from '../src/whatsapp/services/whatsapp.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

function createConfig(overrides: Record<string, string> = {}) {
  const store: Record<string, string> = {
    WA_API_VERSION: 'v21.0',
    WA_PHONE_NUMBER_ID: '12345',
    WA_ACCESS_TOKEN: 'token',
    ...overrides,
  };
  return {
    get: (key: string) => store[key],
  } as unknown as ConfigService;
}

describe('WhatsappService', () => {
  let service: WhatsappService;

  beforeEach(async () => {
    mockedAxios.create.mockReturnValue({
      post: jest.fn(),
      get: jest.fn(),
    } as any);

    const moduleRef = await Test.createTestingModule({
      providers: [WhatsappService, { provide: ConfigService, useValue: createConfig() }],
    }).compile();

    service = moduleRef.get(WhatsappService);
  });

  it('uploadMedia posts form to /{phone}/media', async () => {
    const post = (service as any).http.post as jest.Mock;
    post.mockResolvedValue({ data: { id: 'media123' } });
    const id = await service.uploadMedia(Buffer.from('a'), 'audio/wav');
    expect(id).toBe('media123');
    expect(post).toHaveBeenCalledWith(
      '/12345/media',
      expect.anything(),
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer token' }) }),
    );
  });

  it('sendAudioByMediaId posts to /{phone}/messages with payload', async () => {
    const post = (service as any).http.post as jest.Mock;
    post.mockResolvedValue({ data: {} });
    await service.sendAudioByMediaId('+911234567890', 'media123');
    expect(post).toHaveBeenCalledWith(
      '/12345/messages',
      {
        messaging_product: 'whatsapp',
        to: '+911234567890',
        type: 'audio',
        audio: { id: 'media123' },
      },
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer token' }) }),
    );
  });
});
