import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

declare const self: {
  skipWaiting: () => void;
  clients: { claim: () => void };
  addEventListener: (type: string, listener: EventListener) => void;
  __SW_MANIFEST: (string | { url: string; revision: string | null })[] | undefined;
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
