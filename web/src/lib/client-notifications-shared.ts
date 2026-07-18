/* Tipi notifiche area cliente (no server-only: usati anche nei client component). */

export type ClientNotificationKind =
  | "stato"
  | "imposte"
  | "documento"
  | "finali"
  | "recesso";

export type ClientNotification = {
  id: string;
  kind: ClientNotificationKind;
  title: string;
  body: string;
  href: string;
  practiceId: string | null;
  readAt: string | null;
  createdAt: string;
};
