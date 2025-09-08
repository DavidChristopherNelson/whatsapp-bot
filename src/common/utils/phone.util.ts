/**
 * Convert a WhatsApp wa_id (digits) into E.164 format for India only.
 * - If wa_id starts with '91' and has 12 digits, returns +<wa_id>.
 * - If wa_id has 10 digits, assumes India and prefixes +91.
 * - Otherwise returns null to indicate unsupported.
 */
export function waIdToE164IndiaOnly(waId: string): string | null {
  const digits = (waId || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  return null;
}


