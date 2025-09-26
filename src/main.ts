import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { WhatsappService } from './whatsapp/services/whatsapp.service';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

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
  const port = Number(config.get('PORT')) || 3050;

  // Optional bootstrap hook to upload default voice media if missing
  try {
    const currentId = config.get<string | undefined>('WA_PLEASE_VOICE_MEDIA_ID');
    if (!currentId) {
      const assetPath = path.resolve(process.cwd(), 'assets/please-use-voice-message.ogg');
      const buf = await fs.readFile(assetPath);
      const wa = app.get(WhatsappService);
      const newId = await wa.uploadMedia(buf, 'audio/ogg');
      Logger.log(
        `Uploaded default voice media. Copy this media_id into your .env as WA_PLEASE_VOICE_MEDIA_ID=${newId}`,
      );
    }
  } catch (err) {
    Logger.warn(`Startup media upload skipped/failed: ${(err as Error).message}`);
  }

  await app.listen(port);
}

bootstrap();


