import { Controller, Get, Query, Res, HttpStatus, Post, Body, Headers, UseGuards, Logger, HttpCode } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { WhatsappWebhookPayload, MinimalWebhookValue } from '../../common/dto/whatsapp-webhook.dto';

// Simple optional signature verification guard
import { SignatureGuard } from '../../common/guards/signature.guard';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly config: ConfigService) {}

  @Get()
  verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
    @Res() res: Response,
  ) {
    const verifyToken = this.config.get<string>('VERIFY_TOKEN');
    if (mode === 'subscribe' && token && token === verifyToken) {
      res.status(HttpStatus.OK).type('text/plain').send(challenge ?? '');
    } else {
      res.sendStatus(HttpStatus.FORBIDDEN);
    }
  }

  @Post()
  @HttpCode(200)
  @UseGuards(SignatureGuard)
  async handleWebhook(
    @Body() body: WhatsappWebhookPayload,
    @Headers('x-hub-signature-256') _sig: string | undefined,
  ) {
    const value: MinimalWebhookValue | undefined = body?.entry?.[0]?.changes?.[0]?.value as MinimalWebhookValue | undefined;
    if (value) {
      this.logger.log({ contacts: value.contacts?.[0]?.wa_id, messageType: value.messages?.[0]?.type, messageId: value.messages?.[0]?.id });
    }
    return { status: 'ok' };
  }
}


