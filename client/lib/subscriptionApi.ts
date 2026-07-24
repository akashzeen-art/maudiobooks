import {
  ACTIVE_SUB_ID,
  COUNTRY_CODE,
  INACTIVE_SUB_ID,
  PRODUCT_CODE,
  buildCampaignUrl,
  isActiveStatus,
  normalizeSubscriptionDetail,
  type StatusResponse,
  type SubscriptionDetail,
} from "../../shared/subscription";

const STORAGE_KEYS = {
  subid: "tegab_subid",
  productcode: "tegab_productcode",
  msisdn: "tegab_msisdn",
} as const;

export function getStoredSubid(): string {
  if (typeof window === "undefined") return "0";
  return localStorage.getItem(STORAGE_KEYS.subid) || "0";
}

export function getStoredProductCode(): string {
  if (typeof window === "undefined") return PRODUCT_CODE;
  return localStorage.getItem(STORAGE_KEYS.productcode) || PRODUCT_CODE;
}

export function getStoredMsisdn(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEYS.msisdn) || "";
}

export function setStoredSubid(subid: string) {
  localStorage.setItem(STORAGE_KEYS.subid, subid || "0");
}

export function setStoredProductCode(productcode: string) {
  localStorage.setItem(STORAGE_KEYS.productcode, productcode || PRODUCT_CODE);
}

export function setStoredMsisdn(msisdn: string) {
  localStorage.setItem(STORAGE_KEYS.msisdn, msisdn);
}

/** Capture subid / productcode from portal URL query params. */
export function capturePortalParamsFromUrl() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const subid = params.get("subid");
  const productcode = params.get("productcode");
  if (subid != null && subid !== "") setStoredSubid(subid);
  if (productcode != null && productcode !== "") setStoredProductCode(productcode);
}

export interface StatusCheckResult {
  active: boolean;
  status: number;
  data: StatusResponse | null;
  subid?: string;
}

function msisdnMatches(a: string, b: string): boolean {
  const norm = (v: string) => {
    let d = v.replace(/\D/g, "");
    if (d.startsWith(COUNTRY_CODE)) d = d.slice(COUNTRY_CODE.length);
    return d.replace(/^0+/, "");
  };
  return norm(a) === norm(b) && norm(a).length > 0;
}

export function normalizeUaeMsisdn(localNumber: string): string {
  const digits = localNumber.replace(/\D/g, "");
  const withoutLeadingZero = digits.replace(/^0+/, "");
  if (withoutLeadingZero.startsWith(COUNTRY_CODE)) return withoutLeadingZero;
  return `${COUNTRY_CODE}${withoutLeadingZero}`;
}

export async function checkSubscriptionStatus(
  subid = getStoredSubid(),
  productcode = getStoredProductCode(),
): Promise<StatusCheckResult> {
  const res = await fetch(
    `/api/subscription/status?subid=${encodeURIComponent(subid)}&productcode=${encodeURIComponent(productcode)}`,
  );
  const data = (await res.json()) as StatusResponse;
  // Real API: { status: "1", msisdn, validityfrom, validityto }
  const active = isActiveStatus(data?.status);
  if (data?.msisdn) setStoredMsisdn(String(data.msisdn));
  return {
    active,
    status: active ? 1 : 0,
    data: data ?? null,
    subid,
  };
}

/**
 * Look up whether this mobile number already has an active subscription
 * by checking known Timwe subids and matching returned msisdn.
 */
export async function lookupSubscriptionByMsisdn(
  msisdn: string,
  productcode = getStoredProductCode(),
): Promise<StatusCheckResult> {
  const candidates = [ACTIVE_SUB_ID, INACTIVE_SUB_ID, getStoredSubid()].filter(
    (id, i, arr) => id && id !== "0" && arr.indexOf(id) === i,
  );

  for (const subid of candidates) {
    try {
      const result = await checkSubscriptionStatus(subid, productcode);
      const apiMsisdn = result.data?.msisdn ? String(result.data.msisdn) : "";
      if (apiMsisdn && msisdnMatches(apiMsisdn, msisdn) && result.active) {
        setStoredSubid(subid);
        setStoredMsisdn(normalizeUaeMsisdn(msisdn));
        return { ...result, subid };
      }
    } catch {
      // try next candidate
    }
  }

  return { active: false, status: 0, data: null };
}

export async function fetchSubscriptionDetail(
  subid = getStoredSubid(),
  productcode = getStoredProductCode(),
): Promise<SubscriptionDetail> {
  // Status API returns readable dates: validityfrom / validityto ("2024-04-28")
  // Detail API may return epoch ms — merge with status preferred for dates
  let detailRaw: Record<string, unknown> | null = null;
  let statusRaw: Record<string, unknown> | null = null;

  try {
    const res = await fetch(
      `/api/subscription/detail?subid=${encodeURIComponent(subid)}&productcode=${encodeURIComponent(productcode)}`,
    );
    if (res.ok) detailRaw = (await res.json()) as Record<string, unknown>;
  } catch {
    // ignore
  }

  try {
    const statusRes = await fetch(
      `/api/subscription/status?subid=${encodeURIComponent(subid)}&productcode=${encodeURIComponent(productcode)}`,
    );
    if (statusRes.ok) statusRaw = (await statusRes.json()) as Record<string, unknown>;
  } catch {
    // ignore
  }

  if (!detailRaw && !statusRaw) {
    throw new Error("Failed to load subscription details");
  }

  // Status fields win for dates/msisdn/status (correct backend format)
  const merged = { ...(detailRaw ?? {}), ...(statusRaw ?? {}) };
  return normalizeSubscriptionDetail(merged);
}

export async function deactivateSubscription(
  subid = getStoredSubid(),
  productcode = getStoredProductCode(),
): Promise<unknown> {
  const res = await fetch(
    `/api/subscription/deactivate?subid=${encodeURIComponent(subid)}&productcode=${encodeURIComponent(productcode)}`,
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error("Deactivation failed");
  return data;
}

export function redirectToCampaign(
  _subid = getStoredSubid(),
  _productcode = getStoredProductCode(),
  msisdn = getStoredMsisdn(),
) {
  window.location.href = buildCampaignUrl(_subid, _productcode, msisdn);
}
