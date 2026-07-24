import { FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X } from "lucide-react";
import { COUNTRY_CODE } from "../../shared/subscription";
import { useSubscription } from "../context/SubscriptionContext";

export function PhoneNumberModal() {
  const { phoneModalOpen, closePhoneModal, submitPhoneAndSubscribe, pendingBook } =
    useSubscription();
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (phoneModalOpen) {
      setNumber("");
      setError("");
      setSubmitting(false);
    }
  }, [phoneModalOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Allow 05xxxxxxxx, 5xxxxxxxx, or full 9715xxxxxxxx
    let digits = number.replace(/\D/g, "");
    if (digits.startsWith(COUNTRY_CODE)) {
      digits = digits.slice(COUNTRY_CODE.length);
    }
    digits = digits.replace(/^0+/, "");

    // UAE mobile: 9 digits starting with 5
    if (!/^5\d{8}$/.test(digits)) {
      setError("Enter a valid Etisalat number (e.g. 5X XXX XXXX)");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const granted = await submitPhoneAndSubscribe(digits);
      if (!granted) {
        // Redirect to campaign is in progress
        return;
      }
    } catch {
      setError("Could not verify number. Please try again.");
      setSubmitting(false);
    }
  };

  const localDigits = number.replace(/\D/g, "").replace(new RegExp(`^${COUNTRY_CODE}`), "").replace(/^0+/, "");
  const preview = localDigits ? `+${COUNTRY_CODE}${localDigits}` : `+${COUNTRY_CODE}`;

  return (
    <AnimatePresence>
      {phoneModalOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closePhoneModal}
        >
          <motion.div
            className="relative w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-8 shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10"
              onClick={closePhoneModal}
            >
              <X size={20} className="text-white" />
            </button>

            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-neon-blue/30 to-purple-500/30 border border-neon-blue/30">
              <Phone className="text-neon-blue" size={24} />
            </div>

            <h3 className="text-2xl font-grotesk font-bold text-white text-center mb-2">
              Enter Phone Number
            </h3>
            <p className="text-gray-400 font-poppins text-sm text-center mb-6">
              {pendingBook
                ? `Subscribe to listen to “${pendingBook.title}”`
                : "Subscribe to access premium audiobooks"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 font-poppins mb-2 uppercase tracking-wider">
                  Etisalat Mobile Number
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center px-4 rounded-xl bg-white/5 border border-white/10 text-neon-blue font-poppins font-bold">
                    +{COUNTRY_CODE}
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoFocus
                    placeholder="5XXXXXXXX"
                    maxLength={12}
                    value={number}
                    onChange={(e) => {
                      setNumber(e.target.value.replace(/[^\d]/g, ""));
                      setError("");
                    }}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-poppins placeholder:text-gray-600 focus:outline-none focus:border-neon-blue/50"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 font-poppins">
                  Will subscribe as <span className="text-neon-blue">{preview}</span>
                </p>
                {error && (
                  <p className="mt-2 text-sm text-red-400 font-poppins">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-blue to-purple-500 text-black font-poppins font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? "Redirecting…" : "Continue to Subscribe"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
