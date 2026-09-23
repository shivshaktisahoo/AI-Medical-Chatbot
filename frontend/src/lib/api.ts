import type { DoctorGender } from "../hooks/useDoctorVoice";
import type { ConsultResponse } from "../types";

export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ?? "http://localhost:8000";

export async function consult(params: {
  text: string;
  audioBlob?: Blob | null;
  imageFile?: File | null;
  voiceGender?: DoctorGender;
}): Promise<ConsultResponse> {
  const form = new FormData();
  form.append("text", params.text);
  form.append("voice", params.voiceGender ?? "female");
  if (params.audioBlob) {
    form.append("audio", params.audioBlob, "recording.webm");
  }
  if (params.imageFile) {
    form.append("image", params.imageFile, params.imageFile.name);
  }

  const res = await fetch(`${API_BASE_URL}/api/consult`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail ?? `Request failed (${res.status})`);
  }

  return res.json();
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
}
