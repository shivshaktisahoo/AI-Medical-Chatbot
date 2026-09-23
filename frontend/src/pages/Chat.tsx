import { AlertTriangle, ArrowLeft, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { ChatPanel } from "../components/ChatPanel";
import { DoctorIllustration } from "../components/DoctorIllustration";
import { doctorName } from "../lib/doctor";
import { useDoctorVoice } from "../hooks/useDoctorVoice";
import { useTheme } from "../hooks/useTheme";

export default function Chat() {
  const { dark, toggle } = useTheme();
  const { gender, setGender } = useDoctorVoice();

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-white dark:bg-zinc-950">
      <header className="flex h-[60px] shrink-0 items-center border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-950 sm:px-7">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full bg-zinc-100 py-1.5 pr-3 pl-1.5 text-[13px] font-semibold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white dark:bg-zinc-800">
            <ArrowLeft size={12} />
          </span>
          Back to home
        </Link>

        <div className="ml-6 hidden items-center gap-2 border-l border-zinc-200 pl-6 sm:flex dark:border-zinc-800">
          <div className="grad-bg flex h-[26px] w-[26px] items-center justify-center rounded-lg text-white">
            <span className="text-[11px] font-bold">AI</span>
          </div>
          <span className="text-sm font-semibold">AI Medical Chatbot</span>
        </div>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="hidden items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-2 text-[11px] text-zinc-500 md:flex dark:bg-zinc-900 dark:text-zinc-400">
            <AlertTriangle size={12} />
            Educational demo — not a real doctor
          </div>

          <div className="flex gap-0.5 rounded-full bg-zinc-100 p-0.5 dark:bg-zinc-900">
            <button
              onClick={() => setGender("female")}
              aria-pressed={gender === "female"}
              className={`flex items-center gap-1.5 rounded-full py-1 pr-3 pl-1 text-xs font-semibold transition ${
                gender === "female"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <DoctorIllustration gender="female" size={20} />
              Aria
            </button>
            <button
              onClick={() => setGender("male")}
              aria-pressed={gender === "male"}
              className={`flex items-center gap-1.5 rounded-full py-1 pr-3 pl-1 text-xs font-semibold transition ${
                gender === "male"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <DoctorIllustration gender="male" size={20} />
              Andrew
            </button>
          </div>

          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center pt-5">
        <div className="mb-1 flex items-center gap-2">
          <DoctorIllustration gender={gender} size={26} />
          <span className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">{doctorName(gender)}</span>
          <span className="h-[5px] w-[5px] rounded-full bg-emerald-500" />
          <span className="text-[11.5px] text-zinc-400 dark:text-zinc-500">online</span>
        </div>

        <ChatPanel voiceGender={gender} />
      </div>
    </div>
  );
}
