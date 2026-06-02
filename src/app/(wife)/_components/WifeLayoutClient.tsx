"use client";

import { OrderCartProvider } from "@/contexts/OrderCartContext";
import type { ReactNode } from "react";

export function WifeLayoutClient({ children }: { children: ReactNode }) {
  return (
    <OrderCartProvider>
      {children}
    </OrderCartProvider>
  );
}
