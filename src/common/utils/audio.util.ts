import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomBytes } from 'crypto';

export async function createTempFile(prefix = 'wa_', ext = '.tmp'): Promise<string> {
  const name = `${prefix}${randomBytes(6).toString('hex')}${ext}`;
  const filePath = join(tmpdir(), name);
  await fs.writeFile(filePath, Buffer.alloc(0));
  return filePath;
}

export async function readBufferFromPath(path: string): Promise<Buffer> {
  return fs.readFile(path);
}

export async function writeBufferToPath(path: string, data: Buffer): Promise<void> {
  await fs.writeFile(path, data);
}

export async function safeUnlink(path: string): Promise<void> {
  try {
    await fs.unlink(path);
  } catch {
    // ignore
  }
}


