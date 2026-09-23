import { motion } from "framer-motion";
import { Info, User } from "lucide-react";
import type { ChatMessage } from "../types";
import { AudioPlayer } from "./AudioPlayer";
import { DoctorIllustration } from "./DoctorIllustration";
import { TypingDots } from "./TypingDots";

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const showBubble = message.text || message.isThinking || message.isTranscribing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          <User size={15} />
        </div>
      ) : (
        <DoctorIllustration gender={message.voiceGender ?? "female"} size={32} />
      )}

      <div className={`flex min-w-0 max-w-[85%] flex-col sm:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        {message.imageUrl && (
          <img
            src={message.imageUrl}
            alt="Uploaded attachment"
            className="mb-2 max-h-48 w-auto max-w-full rounded-xl border border-zinc-200 object-cover dark:border-zinc-800"
          />
        )}

        {showBubble && (
          <div
            className={`min-w-0 rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words ${
              isUser
                ? "grad-bg rounded-br-md text-white"
                : "rounded-bl-md bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            }`}
          >
            {message.isTranscribing && <TypingDots label="Transcribing your voice" />}
            {message.isThinking && <TypingDots label="Thinking it through" />}
            {!message.isTranscribing && !message.isThinking && message.text}
          </div>
        )}

        {!message.isThinking && !message.isTranscribing && (showBubble || message.imageUrl) && (
          <span className="mt-1 px-1 text-[11px] text-zinc-400 dark:text-zinc-600">
            {formatTime(message.createdAt)}
          </span>
        )}

        {message.error && (
          <p className="mt-1 rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {message.error}
          </p>
        )}

        {message.notice && (
          <p className="mt-1 flex items-start gap-1.5 rounded-md bg-amber-50 px-3 py-1.5 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            <Info size={13} className="mt-0.5 shrink-0" />
            {message.notice}
          </p>
        )}

        {message.audioBase64 && (
          <div className="mt-1.5">
            <AudioPlayer base64={message.audioBase64} mime={message.audioMime ?? "audio/mpeg"} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
