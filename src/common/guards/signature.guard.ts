import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SignatureGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const enabled = this.config.get<boolean>('VERIFY_SIGNATURE') ?? false;
    const appSecret = this.config.get<string>('APP_SECRET');
    if (!enabled || !appSecret) return true;

    const req = context.switchToHttp().getRequest();
    const signature: string | undefined = req.header('X-Hub-Signature-256') || req.header('x-hub-signature-256');
    const rawBody: Buffer | undefined = req.rawBody;
    if (!signature || !rawBody || !signature.startsWith('sha256=')) return false;

    const expected = 'sha256=' + createHmac('sha256', appSecret).update(rawBody).digest('hex');
    return safeEqual(signature, expected);
  }
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}


