/*
  Definizioni nav Area (senza "use client"): usabili dal layout server
  per costruire le label tradotte da passare ai componenti client.
  Le icone sono chiavi stringa (non componenti): i client le risolvono.
*/

export type AreaNavIconKey =
  | "home"
  | "documenti"
  | "ordine"
  | "comunicazioni"
  | "dati"
  | "mandato"
  | "conclusa"
  | "profilo";

export type AreaNavItem = {
  href: string;
  label: string;
  icon: AreaNavIconKey;
  primary?: boolean;
};

const NAV_DEFS: Omit<AreaNavItem, "label">[] = [
  { href: "/area-riservata/dashboard", icon: "home", primary: true },
  { href: "/area-riservata/documenti", icon: "documenti", primary: true },
  { href: "/area-riservata/ordine", icon: "ordine", primary: true },
  { href: "/area-riservata/comunicazioni", icon: "comunicazioni" },
  { href: "/area-riservata/dati", icon: "dati" },
  { href: "/area-riservata/mandato", icon: "mandato" },
  { href: "/area-riservata/conclusa", icon: "conclusa" },
  { href: "/area-riservata/profilo", icon: "profilo", primary: true },
];

export function buildAreaNavItems(labels: {
  home: string;
  documenti: string;
  ordine: string;
  comunicazioni: string;
  dati: string;
  mandato: string;
  conclusa: string;
  profilo: string;
}): AreaNavItem[] {
  const byHref: Record<string, string> = {
    "/area-riservata/dashboard": labels.home,
    "/area-riservata/documenti": labels.documenti,
    "/area-riservata/ordine": labels.ordine,
    "/area-riservata/comunicazioni": labels.comunicazioni,
    "/area-riservata/dati": labels.dati,
    "/area-riservata/mandato": labels.mandato,
    "/area-riservata/conclusa": labels.conclusa,
    "/area-riservata/profilo": labels.profilo,
  };
  return NAV_DEFS.map((d) => ({ ...d, label: byHref[d.href] ?? d.href }));
}
