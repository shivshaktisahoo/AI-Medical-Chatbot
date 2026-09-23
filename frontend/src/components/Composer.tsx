import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon, Mic, Send, Square, X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { useAudioRecorder } from "../hooks/useAudioRecorder";

interface ComposerProps {
  disabled: boolean;
  onSend: (payload: { text: string; audioBlob: Blob | null; imageFile: File | null }) => void;
}

const MAX_TEXTAREA_HEIGHT = 120;

export function Composer({ disabled, onSend }: ComposerProps) {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isRecording, seconds, start, stop, cancel } = useAudioRecorder();

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [text]);

  const handleFile = (file: File | null) => {
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleMicClick = async () => {
    setMicError(null);
    if (isRecording) {
      const blob = await stop();
      if (blob) onSend({ text, audioBlob: blob, imageFile });
      setText("");
      handleFile(null);
      return;
    }
    try {
      await start();
    } catch {
      setMicError("Microphone access was blocked. Check your browser permissions, or just type instead.");
    }
  };

  const handleSendText = () => {
    if (!text.trim() && !imageFile) return;
    if (isRecording) cancel();
    onSend({ text, audioBlob: null, imageFile });
    setText("");
    handleFile(null);
  };

  return (
    <div
      className="w-full shrink-0 px-4 pt-2 sm:px-6"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto w-full max-w-2xl">
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex items-center gap-2 overflow-hidden"
          >
            <div className="relative">
              <img src={imagePreview} alt="Selected preview" className="h-14 w-14 rounded-lg border border-zinc-200 object-cover dark:border-zinc-700" />
              <button
                onClick={() => handleFile(null)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                aria-label="Remove image"
              >
                <X size={11} />
              </button>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{imageFile?.name}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {micError && <p className="mb-2 text-xs text-red-500">{micError}</p>}

      <div className="flex items-end gap-1.5 rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_8px_24px_-8px_rgba(13,148,136,.18)] dark:border-zinc-800 dark:bg-zinc-900">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isRecording}
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 disabled:opacity-40 dark:text-zinc-400 dark:hover:bg-zinc-800"
          aria-label="Attach a photo"
        >
          <ImageIcon size={17} />
        </button>

        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendText();
              }
            }}
            disabled={disabled || isRecording}
            rows={1}
            placeholder={isRecording ? "Recording… tap the mic again to send" : "Describe what you're feeling, or attach a photo…"}
            className="block max-h-[120px] w-full resize-none bg-transparent px-1.5 py-2 text-sm text-zinc-900 outline-none disabled:opacity-50 dark:text-zinc-100"
          />
        </div>

        <button
          onClick={handleMicClick}
          disabled={disabled}
          className={`relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl transition disabled:opacity-40 ${
            isRecording ? "bg-red-500 text-white" : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          }`}
          aria-label={isRecording ? "Stop recording" : "Record voice"}
        >
          {isRecording && <span className="absolute inset-0 rounded-xl bg-red-400 animate-pulse-ring" />}
          {isRecording ? <Square size={14} className="relative" /> : <Mic size={17} />}
        </button>

        <button
          onClick={handleSendText}
          disabled={disabled || isRecording || (!text.trim() && !imageFile)}
          className="grad-bg flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send"
        >
          <Send size={16} />
        </button>
      </div>

      {isRecording && (
        <p className="mt-1.5 text-center text-xs font-medium text-red-500">
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")} — tap
          the square to stop and send
        </p>
      )}
      </div>
    </div>
  );
}
