import { useEffect, useRef, useState } from "react";
import { consult } from "../lib/api";
import type { DoctorGender } from "../hooks/useDoctorVoice";
import type { ChatMessage } from "../types";
import { Composer } from "./Composer";
import { MessageBubble } from "./MessageBubble";

const WELCOME_TEXT =
  "Hi, I'm your AI health assistant. Tell me what's going on — by voice or text — and feel free to " +
  "attach a photo if it's something visible, like a skin concern.";

interface ChatPanelProps {
  voiceGender: DoctorGender;
}

export function ChatPanel({ voiceGender }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: "welcome", role: "assistant", text: WELCOME_TEXT, voiceGender, createdAt: Date.now() },
  ]);
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Keep the still-unanswered welcome bubble in sync if the user switches doctors before sending anything.
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].id === "welcome" ? [{ ...prev[0], voiceGender }] : prev,
    );
  }, [voiceGender]);

  const handleSend = async ({
    text,
    audioBlob,
    imageFile,
  }: {
    text: string;
    audioBlob: Blob | null;
    imageFile: File | null;
  }) => {
    const userMsgId = crypto.randomUUID();
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        text,
        imageUrl,
        isTranscribing: Boolean(audioBlob) && !text,
        createdAt: Date.now(),
      },
    ]);

    const thinkingId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: thinkingId, role: "assistant", text: "", isThinking: true, voiceGender, createdAt: Date.now() },
    ]);

    setBusy(true);
    try {
      const result = await consult({ text, audioBlob, imageFile, voiceGender });

      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === userMsgId && result.transcript) {
            return { ...m, text: m.text || result.transcript, isTranscribing: false };
          }
          if (m.id === thinkingId) {
            return {
              ...m,
              text: result.reply_text,
              isThinking: false,
              audioBase64: result.audio_base64 ?? undefined,
              audioMime: result.audio_mime,
              notice: result.notice ?? undefined,
            };
          }
          return m;
        }),
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === thinkingId
            ? { ...m, isThinking: false, error: err instanceof Error ? err.message : "Something went wrong." }
            : m.id === userMsgId
              ? { ...m, isTranscribing: false }
              : m,
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center overflow-hidden">
      <div ref={scrollRef} className="chat-scroll w-full flex-1 overflow-y-auto px-4 pt-6 sm:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 pb-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
        </div>
      </div>

      <Composer disabled={busy} onSend={handleSend} />

      <p className="pb-4 text-center text-[10.5px] text-zinc-400 dark:text-zinc-600">
        Free & open source · Groq · OpenRouter · edge-tts
      </p>
    </div>
  );
}
