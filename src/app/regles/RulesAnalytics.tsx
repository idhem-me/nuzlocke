"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const projectKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
const captureEnabled = /^phc_[A-Za-z0-9]+$/.test(projectKey ?? "");
const consentKey = "nuzlocke-audience-consent-v1";
const visitorKey = "nuzlocke-audience-visitor-v1";
const changeEvent = "nuzlocke-audience-change";
type Consent = "granted" | "denied" | null;

let currentConsent: Consent | undefined;

function readConsent(): Consent {
  if (currentConsent !== undefined) return currentConsent;
  try {
    const saved = window.localStorage.getItem(consentKey);
    return saved === "granted" || saved === "denied" ? saved : null;
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === consentKey || event.key === null) {
      currentConsent = undefined;
      listener();
    }
  }
  window.addEventListener(changeEvent, listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(changeEvent, listener);
    window.removeEventListener("storage", onStorage);
  };
}

function chooseConsent(consent: Exclude<Consent, null>) {
  currentConsent = consent;
  try {
    window.localStorage.setItem(consentKey, consent);
    if (consent === "denied") window.localStorage.removeItem(visitorKey);
  } catch {
    // The choice still applies while this tab is open.
  }
  window.dispatchEvent(new Event(changeEvent));
}

function getVisitorId() {
  const newId = window.crypto.randomUUID();
  try {
    const savedId = window.localStorage.getItem(visitorKey);
    if (savedId) return savedId;
    window.localStorage.setItem(visitorKey, newId);
  } catch {
    // The pageview can be sent with an ID used only for this load.
  }
  return newId;
}

export function RulesAnalytics() {
  const consent = useSyncExternalStore(subscribe, readConsent, () => "loading" as const);
  const sent = useRef(false);

  useEffect(() => {
    if (!captureEnabled || consent !== "granted" || sent.current || !window.crypto.randomUUID) return;
    sent.current = true;

    void fetch("https://eu.i.posthog.com/i/v0/e/", {
      method: "POST",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: projectKey,
        distinct_id: getVisitorId(),
        event: "$pageview",
        properties: {
          site: "nuzlocke",
          surface: "public_rules",
          internal_visitor: window.location.hostname !== "nuzlocke-neon.vercel.app",
          $current_url: `${window.location.origin}/regles`,
          $process_person_profile: false,
          $geoip_disable: true,
        },
      }),
    }).catch(() => {
      // Audience measurement never interrupts the rules page.
    });
  }, [consent]);

  if (!captureEnabled || consent === "loading") return null;

  return (
    <Card className="p-4" aria-label="Mesure d’audience">
      <p className="md-body-medium mb-3">
        Si vous l’acceptez, PostHog compte les visites de la page des règles. Vos parties restent sur cet appareil.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="compact"
          variant="outlined"
          aria-pressed={consent === "denied"}
          onClick={() => chooseConsent("denied")}
        >
          Refuser
        </Button>
        <Button
          size="compact"
          variant="tonal"
          aria-pressed={consent === "granted"}
          onClick={() => chooseConsent("granted")}
        >
          Accepter
        </Button>
      </div>
    </Card>
  );
}
