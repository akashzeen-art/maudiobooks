import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, Shield, Loader2 } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useSubscription } from "../context/SubscriptionContext";
import {
  deactivateSubscription,
  fetchSubscriptionDetail,
  getStoredProductCode,
  getStoredSubid,
  redirectToCampaign,
} from "../lib/subscriptionApi";
import { isActiveStatus, type SubscriptionDetail } from "../../shared/subscription";

export default function Account() {
  const { refreshStatus, msisdn } = useSubscription();
  const [detail, setDetail] = useState<SubscriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSubscriptionDetail();
      setDetail(data);
      await refreshStatus();
    } catch {
      setError("Unable to load account details. Please try again.");
      setDetail(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDetail();
  }, []);

  const active = detail ? isActiveStatus(detail.status) : false;

  const handleUnsubscribe = async () => {
    setConfirmOpen(false);
    setActionLoading(true);
    setMessage("");
    setError("");
    try {
      await deactivateSubscription(getStoredSubid(), getStoredProductCode());
      setMessage("You have been unsubscribed successfully.");
      await loadDetail();
    } catch {
      setError("Unsubscribe failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubscribe = () => {
    redirectToCampaign(getStoredSubid() || "0", getStoredProductCode());
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-grotesk font-bold mb-3">
            <span className="text-white">My </span>
            <span className="bg-gradient-to-r from-neon-blue to-purple-500 bg-clip-text text-transparent">
              Account
            </span>
          </h1>
          <p className="text-gray-400 font-poppins">
            Subscription details for maudiobooks
          </p>
        </motion.div>

        <motion.div
          className="rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-6 md:p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-gray-400">
              <Loader2 className="animate-spin" />
              <span className="font-poppins">Loading account…</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-neon-blue/20 border border-neon-blue/30 flex items-center justify-center">
                  <User className="text-neon-blue" size={22} />
                </div>
                <div>
                  <p className="text-white font-grotesk font-bold text-lg">
                    {detail?.service_name || "maudiobooks"}
                  </p>
                  <p className="text-gray-500 font-poppins text-sm">
                    Product: {getStoredProductCode()} · Sub ID: {getStoredSubid()}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <DetailRow
                  icon={<PhoneIcon />}
                  label="MSISDN"
                  value={detail?.msisdn || msisdn || "—"}
                />
                <DetailRow
                  icon={<Calendar size={16} className="text-neon-blue" />}
                  label="Valid From"
                  value={detail?.valid_from || "—"}
                />
                <DetailRow
                  icon={<Calendar size={16} className="text-neon-blue" />}
                  label="Valid To"
                  value={detail?.valid_to || "—"}
                />
                <DetailRow
                  icon={<Shield size={16} className="text-neon-blue" />}
                  label="Status"
                  value={active ? "Active" : "Inactive"}
                  highlight={active}
                />
              </div>

              {error && (
                <p className="mb-4 text-sm text-red-400 font-poppins">{error}</p>
              )}
              {message && (
                <p className="mb-4 text-sm text-emerald-400 font-poppins">{message}</p>
              )}

              {active ? (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setConfirmOpen(true)}
                  className="w-full py-3 rounded-xl border border-red-500/50 text-red-400 font-poppins font-bold hover:bg-red-500/10 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? "Unsubscribing…" : "Unsubscribe"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-purple-500 text-black font-poppins font-bold hover:opacity-90 transition-opacity"
                >
                  Subscribe
                </button>
              )}
            </>
          )}
        </motion.div>
      </div>
      <Footer />

      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8 shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-grotesk font-bold text-white text-center mb-3">
                Unsubscribe?
              </h3>
              <p className="text-gray-400 font-poppins text-sm text-center mb-8">
                Are you sure you want to unsubscribe?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-white/15 text-white font-poppins font-bold hover:bg-white/5 transition-colors"
                >
                  No
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => void handleUnsubscribe()}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-poppins font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/5">
      <div className="flex items-center gap-2 text-gray-400 font-poppins text-sm">
        {icon}
        {label}
      </div>
      <span
        className={`font-poppins font-medium text-sm ${
          highlight ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D9FF" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
