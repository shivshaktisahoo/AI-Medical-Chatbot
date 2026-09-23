export function TypingDots({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 dark:bg-zinc-500"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </span>
      {label}…
    </span>
  );
}
