"use client";

import { useEffect, useSyncExternalStore } from "react";
import { RULES_PATH } from "@/components/layout/NavItems";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const projectId = process.env.NEXT_PUBLIC_CLARITY_ID?.trim();
const enabled = /^[a-z0-9]+$/.test(projectId ?? "");
const consentKey = "nuzlocke-clarity-consent-v1";
const changeEvent = "nuzlocke-clarity-change";

type Consent = "granted" | "denied";
type ClarityWindow = Window & {
  clarity?: ((...args: unknown[]) => void) & { q?: unknown[][] };
};

let clarityLoaded = false;

function eligible() {
  const { pathname, origin, search, hash } = window.location;
  return enabled && pathname === RULES_PATH && !search && !hash &&
    (!document.referrer || document.referrer === origin + RULES_PATH);
}

function readConsent() {
  if (!eligible()) return "unavailable";
  try {
    const saved = window.localStorage.getItem(consentKey);
    return saved === "granted" || saved === "denied" ? saved : null;
  } catch {
    return "unavailable";
  }
}

function subscribe(listener: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === consentKey || event.key === null) listener();
  }
  window.addEventListener(changeEvent, listener);
  window.addEventListener("storage", onStorage);
  window.addEventListener("pageshow", listener);
  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("pageshow", listener);
  };
}

function choose(consent: Consent) {
  try {
    window.localStorage.setItem(consentKey, consent);
  } catch {
    if (clarityLoaded) leaveAfterStopping();
    return;
  }
  if (consent === "denied" && clarityLoaded) leaveAfterStopping();
  else window.dispatchEvent(new Event(changeEvent));
}

function leaveAfterStopping() {
  (window as ClarityWindow).clarity?.("consentv2", {
    analytics_Storage: "denied",
    ad_Storage: "denied",
  });
  // The provider's script belongs to this document. Load a new one to stop it.
  window.location.replace(RULES_PATH);
}

export function RulesClarity() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => "unavailable" as const);

  useEffect(() => {
    if (!enabled) return;
    function onHashChange(event: HashChangeEvent) {
      if (!window.location.hash) return;
      event.stopImmediatePropagation();
      if (clarityLoaded) leaveAfterStopping();
      else window.dispatchEvent(new Event(changeEvent));
    }
    window.addEventListener("hashchange", onHashChange, true);
    return () => window.removeEventListener("hashchange", onHashChange, true);
  }, []);

  useEffect(() => {
    if (consent !== "granted") {
      if (clarityLoaded) leaveAfterStopping();
      return;
    }
    if (clarityLoaded || !eligible()) return;
    clarityLoaded = true;

    const client = window as ClarityWindow;
    client.clarity ??= (...args) => ((client.clarity!.q ??= []).push(args));
    client.clarity("consentv2", { analytics_Storage: "granted", ad_Storage: "denied" });
    const script = document.createElement("script");
    script.async = true;
    script.referrerPolicy = "no-referrer";
    script.src = "https://www.clarity.ms/tag/" + projectId;
    document.head.append(script);
  }, [consent]);

  if (consent === "unavailable") return null;

  return (
    <Card className="p-4" aria-label="Préférences Microsoft Clarity">
      <p className="md-body-medium mb-3">
        Avec votre accord, Microsoft Clarity mesure les interactions et peut les rejouer sur la page des règles.
        Vous pouvez modifier votre choix ici.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="compact" variant="outlined" aria-pressed={consent === "denied"} onClick={() => choose("denied")}>
          Refuser Clarity
        </Button>
        <Button size="compact" variant="tonal" aria-pressed={consent === "granted"} onClick={() => choose("granted")}>
          Autoriser Clarity
        </Button>
      </div>
    </Card>
  );
}
