import "server-only";
import { cookies } from "next/headers";
import {
  ATTR_COOKIE,
  deserializeAttribution,
  type Attribution,
} from "@/lib/attribution-shared";

export async function readRequestAttribution(): Promise<Attribution> {
  const store = await cookies();
  return deserializeAttribution(store.get(ATTR_COOKIE)?.value);
}
