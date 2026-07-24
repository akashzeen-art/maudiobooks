import { useCallback, useEffect, useState } from "react";
import type { Audiobook } from "../data/audiobooks";
import { useSubscription } from "../context/SubscriptionContext";

/** Gate book play behind subscription status / phone popup. */
export function useGatedPlay() {
  const [selectedBook, setSelectedBook] = useState<Audiobook | null>(null);
  const { requestPlay, grantTicket, takeGrantedBook } = useSubscription();

  useEffect(() => {
    if (!grantTicket) return;
    const book = takeGrantedBook();
    if (book) setSelectedBook(book);
  }, [grantTicket, takeGrantedBook]);

  const playBook = useCallback(
    async (book: Audiobook) => {
      const allowed = await requestPlay(book);
      if (allowed) setSelectedBook(book);
    },
    [requestPlay],
  );

  const closePlayer = useCallback(() => setSelectedBook(null), []);

  return { selectedBook, playBook, closePlayer };
}
