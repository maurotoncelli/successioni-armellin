import { t, tObj } from "@/lib/locale";
import { PROFILO_UI_IT, type ProfiloUiLabels } from "@/lib/area-ui-labels";
import { ProfiloClient } from "./profilo-client";

export default async function ProfiloPage() {
  const [title, subtitle, labels] = await Promise.all([
    t("area", "profilo_title", "Profilo"),
    t("area", "profilo_subtitle", "Recapiti, sicurezza e preferenze."),
    tObj<ProfiloUiLabels>("area", "profilo_ui", PROFILO_UI_IT),
  ]);

  return <ProfiloClient title={title} subtitle={subtitle} labels={labels} />;
}
