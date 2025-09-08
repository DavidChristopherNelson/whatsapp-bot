// Minimal DTOs for incoming WhatsApp webhook payloads (Phase 1 placeholders)
export interface WhatsappChangeValue {
  messaging_product: 'whatsapp';
  contacts?: Array<{ wa_id: string; profile?: { name?: string } }>;
  messages?: Array<
    | {
        id: string; // wamid
        from: string;
        type: 'text';
      }
    | {
        id: string; // wamid
        from: string;
        type: 'audio';
        audio: { id: string };
      }
  >;
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

// Narrowed helper type for the parts we log/use soon
export type MinimalWebhookValue = Pick<WhatsappChangeValue, 'contacts' | 'messages'> & {
  messaging_product: 'whatsapp';
};


