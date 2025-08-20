"use client";
import SnackBarAlert from "@/components/common/SnackBarAlert";
import InitColorSchemeScript from "@/components/common/InitColorSchemeScript";
import { AppContextProvider } from "@/contexts/AppContext";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import "@/styles/globals.scss";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import ProgressBar from "@/components/common/ProgressBar";

// Timezone Configurations
import "../utils/dayjs-config";
import { AuthContextProvider } from "@/contexts/AuthContext";

// Create a client
const queryClient = new QueryClient();

export default function ClientLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <InitColorSchemeScript />
      <QueryClientProvider client={queryClient}>
        <AppRouterCacheProvider>
          <AppContextProvider>
            <AuthContextProvider>
              <ProgressBar />
              <ThemeContextProvider>{children}</ThemeContextProvider>
              <SnackBarAlert />
              <ReactQueryDevtools initialIsOpen={false} />
            </AuthContextProvider>
          </AppContextProvider>
        </AppRouterCacheProvider>
      </QueryClientProvider>
    </>
  );
}