/** Public support / contact constants. Centralised so links stay consistent
 *  across the pay flow, trust sections and the Founder Console. */

// E.164 without '+'. WhatsApp deep-links use this form (wa.me/<number>).
export const SUPPORT_WHATSAPP = "917248556138";

/** Build a wa.me link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${SUPPORT_WHATSAPP}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
