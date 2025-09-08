// Minimal DTOs for incoming WhatsApp webhook payloads (Phase 1 placeholders)
export interface WhatsappChangeValue {
  messaging_product: 'whatsapp';
  metadata?: unknown;
  contacts?: Array<{ wa_id: string; profile?: { name?: string } }>;
  messages?: Array<{ id: string; from: string; type: string; timestamp?: string }>; // expand later
}

export interface WhatsappEntryChange {
  field: string;
  value: WhatsappChangeValue;
}

export interface WhatsappWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: WhatsappEntryChange[];
  }>;
}


