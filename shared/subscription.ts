/**
 * Timwe Etisalat — Global Audio Books (TEGAB)
 */
export const PRODUCT_CODE = "TEGAB";
export const ACTIVE_SUB_ID = "27894194";
export const INACTIVE_SUB_ID = "27891665";
export const COUNTRY_CODE = "971";

export const ADPOKE_BASE = "http://64.225.87.221/adpoke/cnt";

/** Subscribe / campaign landing (OTP portal) — used when no MSISDN yet */
export const CAMPAIGN_URL =
  "http://64.225.87.221/adpoke/cnt/cmp?adid=15&cmpid=206&token=portal";

/** Real status API response, e.g. subid=27894194 */
export interface StatusResponse {
  status: number | string;
  msisdn?: string;
  validityfrom?: string;
  validityto?: string;
  valid_from?: string;
  valid_to?: string;
  service_name?: string;
}

export interface SubscriptionDetail {
  msisdn: string;
  valid_from: string;
  valid_to: string;
  status: number | string;
  service_name: string;
}

export function buildStatusUrl(subid: string, productcode: string) {
  return `${ADPOKE_BASE}/sub/status?subid=${encodeURIComponent(subid)}&productcode=${encodeURIComponent(productcode)}`;
}

/**
 * Activation / campaign URL.
 * With msisdn → act API so the entered number is used for subscribe.
 * Without msisdn → cmp portal (user enters number there).
 */
export function buildCampaignUrl(subid?: string, productcode?: string, msisdn?: string) {
  const sid = subid && subid.trim() !== "" ? subid.trim() : "0";
  const pc = productcode && productcode.trim() !== "" ? productcode.trim() : PRODUCT_CODE;

  if (msisdn && msisdn.trim()) {
    const params = new URLSearchParams({
      subid: sid,
      productcode: pc,
      msisdn: msisdn.trim(),
    });
    return `${ADPOKE_BASE}/act?${params.toString()}`;
  }

  return CAMPAIGN_URL;
}

export function buildDetailUrl(subid: string, productcode: string) {
  return `${ADPOKE_BASE}/sub/detail?subid=${encodeURIComponent(subid)}&productcode=${encodeURIComponent(productcode)}`;
}

export function buildDeactivateUrl(subid: string, productcode: string) {
  return `${ADPOKE_BASE}/dct?subid=${encodeURIComponent(subid)}&productcode=${encodeURIComponent(productcode)}`;
}

export function isActiveStatus(status: number | string | undefined | null): boolean {
  return status === 1 || status === "1" || String(status).toLowerCase() === "active";
}

/** Format API date: "2024-04-28" or epoch ms like 1714280602000 */
export function formatValidityDate(value: unknown): string {
  if (value == null || value === "") return "—";

  // Epoch milliseconds (number or numeric string)
  const asNum = typeof value === "number" ? value : Number(String(value).trim());
  if (Number.isFinite(asNum) && asNum > 1e11) {
    const d = new Date(asNum);
    if (!Number.isNaN(d.getTime())) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const hh = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    }
  }

  const str = String(value).trim();
  // Already a date string from status API e.g. "2024-04-28"
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str;
  return str || "—";
}

function pickValidity(...candidates: unknown[]): string {
  for (const c of candidates) {
    if (c == null || c === "") continue;
    const formatted = formatValidityDate(c);
    if (formatted && formatted !== "—") return formatted;
  }
  return "—";
}

/** Normalize status or detail payloads into a consistent account shape. */
export function normalizeSubscriptionDetail(
  data: StatusResponse | SubscriptionDetail | Record<string, unknown>,
): SubscriptionDetail {
  const raw = data as Record<string, unknown>;
  // Prefer status-API fields (validityfrom / validityto) over epoch timestamps
  return {
    msisdn: String(raw.msisdn ?? ""),
    valid_from: pickValidity(raw.validityfrom, raw.valid_from, raw.validity_from),
    valid_to: pickValidity(raw.validityto, raw.valid_to, raw.validity_to),
    status: (raw.status as number | string) ?? 0,
    service_name: String(raw.service_name ?? raw.servicename ?? "maudiobooks").replace(
      /_/g,
      " ",
    ),
  };
}
