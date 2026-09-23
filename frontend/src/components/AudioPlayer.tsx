import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export function AudioPlayer({ base64, mime }: { base64: string; mime: string }) {
  const src = useMemo(() => `data:${mime};base64,${base64}`, [base64, mime]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  return (
    <div className="flex w-full max-w-64 min-w-0 items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
      <audio ref={audioRef} src={src} preload="none" />
      <button
        onClick={toggle}
        className="grad-bg flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white transition hover:brightness-105"
        aria-label={playing ? "Pause" : "Play doctor's reply"}
      >
        {playing ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
      </button>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
        <div
          className="grad-bg h-full rounded-full transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
