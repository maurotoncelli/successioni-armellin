import { text } from "@/lib/content";
import { getRequestLocale } from "@/lib/locale";
import { AuthCallbackClient } from "./callback-client";

export default async function AuthCallbackPage() {
  const locale = await getRequestLocale();
  const loadingLabel = text(
    "area_login",
    "callback_loading",
    "Accesso in corso…",
    locale,
  );
  const failedLabel = text(
    "area_login",
    "callback_failed",
    "Accesso non riuscito, ti reindirizzo…",
    locale,
  );

  return (
    <AuthCallbackClient
      loadingLabel={loadingLabel}
      failedLabel={failedLabel}
    />
  );
}
