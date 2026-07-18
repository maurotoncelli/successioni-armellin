import "server-only";

/*
  Invio email transazionali (@05 automazioni). Provider: Resend via API REST
  (nessuna dipendenza extra). Fallback GRACEFUL come Stripe/Supabase: se manca
  RESEND_API_KEY non si rompe nulla, si logga e si salta l'invio. Le chiavi si
  impostano quando il dominio sara registrato (vedi PROSSIMO_INCONTRO_LORENZO).
*/

export const isEmailConfigured = Boolean(process.env.RESEND_API_KEY);

const FROM =
  process.env.EMAIL_FROM ||
  "Successioni Armellin <noreply@successioniarmellin.it>";

export async function sendEmail(input: {
  to: string | string[];
  subject: string;
  html: string;
  /** Resend schedule: linguaggio naturale ("in 48 hours") o ISO 8601. */
  scheduledAt?: string;
}): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[email] non configurato (RESEND_API_KEY assente), skip:", input.subject);
    return { sent: false };
  }
  const to = (Array.isArray(input.to) ? input.to : [input.to]).filter(Boolean);
  if (to.length === 0) return { sent: false };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to,
        subject: input.subject,
        html: input.html,
        ...(input.scheduledAt ? { scheduled_at: input.scheduledAt } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[email] invio fallito:", res.status, await res.text());
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error("[email] errore di rete:", err);
    return { sent: false };
  }
}

// Wrapper HTML semplice e brandizzato (inline styles per compatibilita client email).
export function emailLayout(opts: {
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** Lingua comunicazioni: ar → dir=rtl + footer cortesia. */
  locale?: string;
}): string {
  const ar = opts.locale === "ar";
  const dir = ar ? "rtl" : "ltr";
  const lang = ar ? "ar" : "it";
  const footer = ar
    ? "Geom. Lorenzo Armellin · أُرسلت هذه الرسالة تلقائيًا؛ يمكنك الرد للتواصل معنا. (ترجمة تلقائية للتيسير — المستندات الرسمية بالإيطالية.)"
    : "Geom. Lorenzo Armellin · Questo messaggio e stato inviato automaticamente, puoi rispondere per contattarci.";
  const cta =
    opts.ctaLabel && opts.ctaHref
      ? `<tr><td style="padding:8px 0 24px">
           <a href="${opts.ctaHref}" style="display:inline-block;background:#1f6f5c;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600">${opts.ctaLabel}</a>
         </td></tr>`
      : "";
  return `<!doctype html><html lang="${lang}" dir="${dir}"><body style="margin:0;background:#f4f5f3;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1f1c" dir="${dir}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f3;padding:24px 0" dir="${dir}">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e6e8e4">
          <tr><td style="background:#1f6f5c;padding:18px 28px;color:#fff;font-weight:700;font-size:16px">Successioni Armellin</td></tr>
          <tr><td style="padding:28px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="font-size:20px;font-weight:700;padding-bottom:12px">${opts.heading}</td></tr>
              <tr><td style="font-size:15px;line-height:1.6;color:#3a423c">${opts.bodyHtml}</td></tr>
              ${cta}
            </table>
          </td></tr>
          <tr><td style="padding:18px 28px;background:#fafbf9;border-top:1px solid #eef0ec;font-size:12px;color:#8a938c">
            ${footer}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`;
}
