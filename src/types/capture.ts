export interface Capture {
  speciesId: number | null;
  speciesName: string;
  spriteUrl: string | null;
  nickname: string;
  captureFailed: boolean;
  /** Date et heure de la capture ou de l'échec (ISO 8601). */
  capturedAt: string | null;
}

export function createEmptyCapture(): Capture {
  return {
    speciesId: null,
    speciesName: "",
    spriteUrl: null,
    nickname: "",
    captureFailed: false,
    capturedAt: null,
  };
}

export function stampCaptureTime(
  prev: Capture,
  patch: Partial<Capture>,
): Partial<Capture> {
  const isNewCapture =
    (patch.speciesId != null && patch.speciesId !== prev.speciesId) ||
    (patch.captureFailed === true && !prev.captureFailed) ||
    (Boolean(patch.speciesName?.trim()) && !prev.speciesName.trim());

  if (isNewCapture) {
    return { ...patch, capturedAt: new Date().toISOString() };
  }
  return patch;
}
