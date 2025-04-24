"use client";

import { useEffect, useTransition } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

export default function ProgressBar() {
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  useEffect(() => {
    NProgress.start();

    startTransition(() => {
      setTimeout(() => {
        NProgress.done();
      }, 300);
    });
  }, [pathname]);

  return null;
}
