import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { promises as fs } from 'fs';
import { join } from 'path';
import { WhatsappService } from './whatsapp/services/whatsapp.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  // Capture raw body for signature verification when enabled
  app.use(
    json({
      verify: (req: any, _res: any, buf: Buffer) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(
    urlencoded({
      extended: true,
      verify: (req: any, _res: any, buf: Buffer) => {
        req.rawBody = buf;
      },
    }),
  );
  await maybeUploadDefaultVoice(app.get(WhatsappService), config);
  const port = Number(config.get('PORT')) || 3050;
  await app.listen(port);
}

async function maybeUploadDefaultVoice(wa: WhatsappService, config: ConfigService): Promise<void> {
  const existing = config.get<string>('WA_PLEASE_VOICE_MEDIA_ID');
  if (existing) return;
  try {
    const wav = await fs.readFile(join(process.cwd(), 'assets/please-use-voice.wav'));
    const id = await wa.uploadMedia(wav, 'audio/wav');
    // eslint-disable-next-line no-console
    console.log(`Uploaded default voice prompt. media_id: ${id}`);
  } catch {
    // eslint-disable-next-line no-console
    console.log('Default voice asset not uploaded. Provide WA_PLEASE_VOICE_MEDIA_ID to skip.');
  }
}

bootstrap();


