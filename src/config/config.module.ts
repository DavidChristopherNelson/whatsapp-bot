import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { envSchema } from './config.schema';
import { z } from 'zod';

function validateEnv(config: Record<string, unknown>) {
  const parsed = envSchema.safeParse(config);
  if (!parsed.success) {
    const formatted = parsed.error.errors
      .map((e) => `${e.path.join('.')}: ${e.message}`)
      .join(', ');
    throw new Error(`Invalid environment: ${formatted}`);
  }
  return parsed.data as z.infer<typeof envSchema>;
}

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv as unknown as (config: Record<string, unknown>) => Record<string, unknown>,
    }),
  ],
})
export class ConfigModule {}


