import { RequestHandler } from "express";
import {
  PRODUCT_CODE,
  buildCampaignUrl,
  buildDeactivateUrl,
  buildDetailUrl,
  buildStatusUrl,
} from "../../shared/subscription";

function resolveParams(query: Record<string, unknown>) {
  const subid =
    typeof query.subid === "string" && query.subid.trim() !== ""
      ? query.subid.trim()
      : "0";
  const productcode =
    typeof query.productcode === "string" && query.productcode.trim() !== ""
      ? query.productcode.trim()
      : PRODUCT_CODE;
  return { subid, productcode };
}

async function fetchAdpoke(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const text = await response.text();
  let data: unknown = text;
  try {
    data = JSON.parse(text);
  } catch {
    // keep raw text
  }
  return { ok: response.ok, status: response.status, data };
}

export const handleSubscriptionStatus: RequestHandler = async (req, res) => {
  try {
    const { subid, productcode } = resolveParams(req.query as Record<string, unknown>);
    const result = await fetchAdpoke(buildStatusUrl(subid, productcode));
    res.status(result.ok ? 200 : result.status).json(result.data);
  } catch (error) {
    console.error("status check failed", error);
    res.status(500).json({ status: 0, error: "Status check failed" });
  }
};

export const handleSubscriptionDetail: RequestHandler = async (req, res) => {
  try {
    const { subid, productcode } = resolveParams(req.query as Record<string, unknown>);
    const result = await fetchAdpoke(buildDetailUrl(subid, productcode));
    res.status(result.ok ? 200 : result.status).json(result.data);
  } catch (error) {
    console.error("detail fetch failed", error);
    res.status(500).json({ error: "Detail fetch failed" });
  }
};

export const handleSubscriptionDeactivate: RequestHandler = async (req, res) => {
  try {
    const { subid, productcode } = resolveParams(req.query as Record<string, unknown>);
    const result = await fetchAdpoke(buildDeactivateUrl(subid, productcode));
    res.status(result.ok ? 200 : result.status).json(result.data ?? { success: true });
  } catch (error) {
    console.error("deactivate failed", error);
    res.status(500).json({ error: "Deactivation failed" });
  }
};

export const handleCampaignUrl: RequestHandler = (req, res) => {
  const { subid, productcode } = resolveParams(req.query as Record<string, unknown>);
  const msisdn = typeof req.query.msisdn === "string" ? req.query.msisdn : undefined;
  res.json({ url: buildCampaignUrl(subid, productcode, msisdn) });
};
