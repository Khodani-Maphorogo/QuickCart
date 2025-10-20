'use client';  // MUST be the very first line!

import { AppContextProvider } from "@/context/AppContext";

export default function Providers({ children }) {
  return (
    <AppContextProvider>
      {children}
    </AppContextProvider>
  );
}
