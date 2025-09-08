import { z } from 'zod';

export const envSchema = z.object({
  WA_ACCESS_TOKEN: z.string().min(1),
  WA_WABA_ID: z.string().min(1),
  WA_PHONE_NUMBER_ID: z.string().min(1),
  WA_API_VERSION: z.string().min(1),
  VERIFY_TOKEN: z.string().min(1),
  APP_SECRET: z.string().optional(),
  PLATFORM_BASE_URL: z.string().url(),
  PLATFORM_WHATSAPP_ENDPOINT: z.string().min(1),
  WA_PLEASE_VOICE_MEDIA_ID: z.string().optional(),
  VERIFY_SIGNATURE: z
    .union([z.boolean(), z.string()])
    .transform((v) => (typeof v === 'string' ? v === 'true' : v))
    .optional()
    .default(false),
  PORT: z.coerce.number().int().positive().default(3050),
});

export type Env = z.infer<typeof envSchema>;


