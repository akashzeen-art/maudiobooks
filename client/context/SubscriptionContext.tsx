import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Audiobook } from "../data/audiobooks";
import {
  capturePortalParamsFromUrl,
  checkSubscriptionStatus,
  getStoredMsisdn,
  getStoredProductCode,
  getStoredSubid,
  lookupSubscriptionByMsisdn,
  normalizeUaeMsisdn,
  redirectToCampaign,
  setStoredMsisdn,
  setStoredSubid,
} from "../lib/subscriptionApi";

interface SubscriptionContextValue {
  subid: string;
  productcode: string;
  msisdn: string;
  isSubscribed: boolean | null;
  checking: boolean;
  phoneModalOpen: boolean;
  pendingBook: Audiobook | null;
  grantTicket: number;
  refreshStatus: () => Promise<boolean>;
  requestPlay: (book: Audiobook) => Promise<boolean>;
  closePhoneModal: () => void;
  submitPhoneAndSubscribe: (localNumber: string) => Promise<boolean>;
  goToCampaign: () => void;
  takeGrantedBook: () => Audiobook | null;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subid, setSubid] = useState("0");
  const [productcode, setProductcode] = useState("TEGAB");
  const [msisdn, setMsisdn] = useState("");
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [pendingBook, setPendingBook] = useState<Audiobook | null>(null);
  const [grantTicket, setGrantTicket] = useState(0);
  const grantedBookRef = useRef<Audiobook | null>(null);

  const refreshStatus = useCallback(async () => {
    setChecking(true);
    try {
      const result = await checkSubscriptionStatus();
      setIsSubscribed(result.active);
      if (result.data?.msisdn) {
        setMsisdn(String(result.data.msisdn));
      }
      return result.active;
    } catch {
      setIsSubscribed(false);
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    capturePortalParamsFromUrl();
    setSubid(getStoredSubid());
    setProductcode(getStoredProductCode());
    setMsisdn(getStoredMsisdn());
    void refreshStatus();
  }, [refreshStatus]);

  const requestPlay = useCallback(
    async (book: Audiobook) => {
      const active = await refreshStatus();
      if (active) {
        setPhoneModalOpen(false);
        setPendingBook(null);
        return true;
      }
      setPendingBook(book);
      setPhoneModalOpen(true);
      return false;
    },
    [refreshStatus],
  );

  const closePhoneModal = useCallback(() => {
    setPhoneModalOpen(false);
    setPendingBook(null);
  }, []);

  const goToCampaign = useCallback(() => {
    redirectToCampaign(getStoredSubid() || "0", getStoredProductCode());
  }, []);

  const takeGrantedBook = useCallback(() => {
    const book = grantedBookRef.current;
    grantedBookRef.current = null;
    return book;
  }, []);

  const submitPhoneAndSubscribe = useCallback(
    async (localNumber: string) => {
      const full = normalizeUaeMsisdn(localNumber);
      setStoredMsisdn(full);
      setMsisdn(full);

      // If this number is already active on Timwe → grant portal access
      try {
        const lookup = await lookupSubscriptionByMsisdn(full, getStoredProductCode());
        if (lookup.active && lookup.subid) {
          setStoredSubid(lookup.subid);
          setSubid(lookup.subid);
          setIsSubscribed(true);
          setPhoneModalOpen(false);
          grantedBookRef.current = pendingBook;
          setPendingBook(null);
          setGrantTicket((n) => n + 1);
          return true;
        }
      } catch {
        // fall through to campaign
      }

      // Not active yet → send to activation with this MSISDN
      redirectToCampaign(getStoredSubid() || "0", getStoredProductCode(), full);
      return false;
    },
    [pendingBook],
  );

  const value = useMemo(
    () => ({
      subid,
      productcode,
      msisdn,
      isSubscribed,
      checking,
      phoneModalOpen,
      pendingBook,
      grantTicket,
      refreshStatus,
      requestPlay,
      closePhoneModal,
      submitPhoneAndSubscribe,
      goToCampaign,
      takeGrantedBook,
    }),
    [
      subid,
      productcode,
      msisdn,
      isSubscribed,
      checking,
      phoneModalOpen,
      pendingBook,
      grantTicket,
      refreshStatus,
      requestPlay,
      closePhoneModal,
      submitPhoneAndSubscribe,
      goToCampaign,
      takeGrantedBook,
    ],
  );

  return (
    <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}
