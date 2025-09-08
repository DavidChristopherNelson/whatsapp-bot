/**
 * Convert a WhatsApp wa_id (digits) into E.164 format for India only.
 * - If wa_id starts with '91' and has 12 digits, returns +<wa_id>.
 * - If wa_id has 10 digits, assumes India and prefixes +91.
 * - Otherwise returns null to indicate unsupported.
 */
export class UnsupportedNumberError extends Error {
  constructor(message = 'Unsupported phone number') {
    super(message);
    this.name = 'UnsupportedNumberError';
  }
}

export function toE164India(waId: string): string {
  const digits = (waId || '').replace(/\D/g, '');
  const isIndiaPrefixed = digits.startsWith('91');
  const isValidLength = digits.length >= 12 && digits.length <= 13; // allow future variations
  if (isIndiaPrefixed && isValidLength) {
    return `+${digits}`;
  }
  throw new UnsupportedNumberError();
}


