// app/providers.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren, useState } from "react";
import SettingsProvider from "@/context/settings";

const Providers = ({ children }: PropsWithChildren) => {
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      <SettingsProvider>
        {children}
      </SettingsProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;