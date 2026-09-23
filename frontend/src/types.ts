import type { DoctorGender } from "./hooks/useDoctorVoice";

export type Role = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  imageUrl?: string;
  audioBase64?: string;
  audioMime?: string;
  isTranscribing?: boolean;
  isThinking?: boolean;
  error?: string;
  notice?: string;
  voiceGender?: DoctorGender;
  createdAt: number;
}

export interface ConsultResponse {
  transcript: string | null;
  reply_text: string;
  audio_base64: string | null;
  audio_mime: string;
  notice: string | null;
}
