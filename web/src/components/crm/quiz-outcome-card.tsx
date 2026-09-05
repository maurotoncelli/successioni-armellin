import { ClipboardList } from "lucide-react";
import { CrmCard, SectionTitle } from "@/components/crm/ui";
import {
  QUIZ_ORIGIN_IT,
  answersFields,
  esitoReason,
  esitoTitle,
  formatDateAtTimeIt,
  formatEuro,
  type PracticeQuiz,
} from "@/lib/quiz-summary";
import { cn } from "@/lib/utils";

/*
  Card "Questionario dal sito" nella scheda pratica: cosa ha visto il
  visitatore (esito in chiaro con la cifra esatta), quando (ora italiana),
  da dove arriva e cosa ha risposto. Niente sigle a/b/c.
*/

const toneByEsito = {
  a: "border-crm-amber/40 bg-crm-amber/10 text-crm-amber",
  b: "border-crm-green/40 bg-crm-green/10 text-crm-green",
  c: "border-crm-purple/40 bg-crm-purple/10 text-crm-purple",
} as const;

export function QuizOutcomeCard({ quiz }: { quiz: PracticeQuiz }) {
  const s = quiz.snapshot;
  const items = s.lineItems ?? [];
  const reason = esitoReason(s);

  return (
    <CrmCard>
      <div className="flex items-center justify-between gap-2">
        <SectionTitle>Questionario dal sito</SectionTitle>
        <span className="flex items-center gap-1.5 text-xs text-crm-muted">
          <ClipboardList className="h-3.5 w-3.5" />
          {quiz.at ? `Compilato il ${formatDateAtTimeIt(quiz.at)}` : "Orario non disponibile"}
        </span>
      </div>

      <div
        className={cn(
          "mt-4 rounded-lg border px-4 py-3",
          toneByEsito[s.esito],
        )}
      >
        <p className="text-sm font-semibold">{esitoTitle(s)}</p>
        {reason && <p className="mt-1 text-xs opacity-90">{reason}</p>}
        {s.esito === "b" && items.length > 1 && (
          <div className="mt-3 space-y-1 border-t border-white/10 pt-2 text-xs">
            {items.map((li, i) => (
              <div key={i} className="flex justify-between gap-3">
                <span>{i === 0 ? `Pacchetto ${s.packageName ?? ""}`.trim() : li.label}</span>
                <span className="shrink-0 font-medium">
                  {i === 0 ? "" : "+ "}
                  {formatEuro(li.amount)}
                </span>
              </div>
            ))}
            <div className="flex justify-between gap-3 border-t border-white/10 pt-1 font-semibold">
              <span>Totale onorario proposto</span>
              <span>{formatEuro(s.total ?? items.reduce((sum, li) => sum + li.amount, 0))}</span>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-crm-text2">{QUIZ_ORIGIN_IT[quiz.origin]}</p>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
        {answersFields(s).map((f) => (
          <div key={f.label}>
            <dt className="text-xs text-crm-muted">{f.label}</dt>
            <dd className="text-crm-text">{f.value}</dd>
          </div>
        ))}
      </dl>

      {quiz.derived && (
        <p className="mt-3 text-xs text-crm-muted">
          Pratica precedente al 05/09/2026: le risposte sono ricostruite dai dati
          salvati (alcune, come «altri beni», non erano registrate).
        </p>
      )}
    </CrmCard>
  );
}
