import { ReplyService } from '../src/whatsapp/services/reply.service';
import { WhatsappService } from '../src/whatsapp/services/whatsapp.service';

describe('ReplyService', () => {
  const whatsapp = {
    sendAudioByMediaId: jest.fn(),
  } as unknown as WhatsappService;

  const service = new ReplyService(whatsapp);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls sendAudioByMediaId for text message when env media id present', async () => {
    process.env.WA_PLEASE_VOICE_MEDIA_ID = 'media123';
    await service.handleIncoming({
      messaging_product: 'whatsapp',
      contacts: [{ wa_id: '987' }],
      messages: [{ id: 'wamid', from: '987', type: 'text' }],
    });
    expect(whatsapp.sendAudioByMediaId).toHaveBeenCalledWith('987', 'media123');
  });

  it('does nothing when no media id in env', async () => {
    delete process.env.WA_PLEASE_VOICE_MEDIA_ID;
    await service.handleIncoming({
      messaging_product: 'whatsapp',
      contacts: [{ wa_id: '987' }],
      messages: [{ id: 'wamid', from: '987', type: 'text' }],
    });
    expect(whatsapp.sendAudioByMediaId).not.toHaveBeenCalled();
  });
});


