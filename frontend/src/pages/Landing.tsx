import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Image as ImageIcon,
  Mic,
  Play,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import { DoctorIllustration } from "../components/DoctorIllustration";
import { GithubMark } from "../components/GithubMark";

const FEATURES = [
  {
    icon: Mic,
    title: "Speak naturally",
    desc: "Record your symptoms right in the browser — no app to install.",
  },
  {
    icon: ImageIcon,
    title: "Show, don't just tell",
    desc: "Attach a photo of a visible concern for extra context.",
  },
  {
    icon: Volume2,
    title: "Hear the answer",
    desc: "Every reply is read back in a natural voice you choose.",
  },
  {
    icon: ShieldCheck,
    title: "Always answers",
    desc: "A built-in fallback means it never goes down, even offline.",
  },
];

const STEPS = [
  { n: 1, title: "Describe it", desc: "Type, talk, or attach a photo — whatever's easiest." },
  { n: 2, title: "The AI looks it over", desc: "A vision-and-language model reasons through what you shared." },
  { n: 3, title: "Get a spoken answer", desc: "Plain-language guidance, read aloud, with next steps." },
];

const STATS = [
  { value: "$0", label: "Cost to run" },
  { value: "3", label: "Free AI providers, chained" },
  { value: "24/7", label: "Always answers, even offline" },
];

export default function Landing() {
  return (
    <div className="min-h-dvh bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* NAV */}
      <header className="flex h-[72px] items-center border-b border-primary-50 px-6 dark:border-zinc-900 sm:px-14">
        <div className="flex items-center gap-2.5">
          <div className="grad-bg flex h-8 w-8 items-center justify-center rounded-lg text-white">
            <Sparkles size={16} strokeWidth={2.2} />
          </div>
          <span className="text-[15px] font-bold">AI Medical Chatbot</span>
        </div>
        <div className="ml-auto hidden items-center gap-7 sm:flex">
          <a href="#features" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            How it works
          </a>
          <a
            href="https://github.com/shivshaktisahoo/AI-Medical-Chatbot"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400"
          >
            <GithubMark size={14} /> GitHub
          </a>
          <Link to="/chat" className="grad-bg rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(13,148,136,.5)]">
            Try it free
          </Link>
        </div>
        <Link to="/chat" className="grad-bg ml-auto rounded-lg px-3.5 py-2 text-sm font-semibold text-white sm:hidden">
          Try it
        </Link>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-16 pb-14 sm:px-14 sm:pt-20">
        <motion.div
          className="pointer-events-none absolute -top-32 -right-10 h-[560px] w-[560px] rounded-full opacity-30 blur-[90px] dark:opacity-20"
          style={{ backgroundImage: "linear-gradient(135deg, #5eead4, #67e8f9)" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-12 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3.5 py-1.5 text-xs font-bold text-primary-700 dark:border-primary-900/50 dark:bg-primary-950/40 dark:text-primary-300">
              <Sparkles size={12} /> 100% free APIs · open source
            </div>
            <h1 className="font-serif text-4xl leading-[1.1] font-semibold sm:text-6xl">
              Your AI doctor,
              <br />
              <span className="grad-text">ready when you</span>
              <br />
              are.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
              Describe a symptom by voice or text, attach a photo if it's something visible, and get a spoken,
              plain-language answer — in seconds, for free.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                to="/chat"
                className="grad-bg flex items-center gap-2 rounded-xl px-6 py-3.5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(13,148,136,.5)] transition hover:brightness-105"
              >
                Start a consultation <ArrowRight size={16} />
              </Link>
              <span className="text-sm text-zinc-400 dark:text-zinc-500">No sign-up · nothing to install</span>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-8 border-t border-primary-50 pt-9 dark:border-zinc-900">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-serif text-2xl font-semibold">{s.value}</div>
                  <div className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative flex h-[420px] flex-1 items-center justify-center sm:h-[480px]"
          >
            <div className="absolute h-[380px] w-[380px] rounded-full bg-primary-50 dark:bg-primary-950/30" />

            <motion.div
              className="relative z-10"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <DoctorIllustration gender="male" size={260} ringColor="#FFFFFF" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute top-4 right-0 w-[210px] rounded-2xl border border-primary-50 bg-white p-3.5 shadow-[0_16px_40px_-12px_rgba(13,148,136,.35)] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="text-[11.5px] leading-snug text-zinc-700 dark:text-zinc-300">
                "That sounds like mild contact dermatitis — keep it clean and dry…"
              </p>
              <div className="mt-2.5 flex items-center gap-1.5">
                <div className="grad-bg flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full">
                  <Play size={8} className="fill-white text-white" />
                </div>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-primary-50 dark:bg-zinc-800">
                  <motion.div
                    className="grad-bg h-full rounded-full"
                    animate={{ width: ["8%", "92%", "8%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute bottom-6 left-0 flex items-center gap-2 rounded-full border border-primary-50 bg-white px-4 py-2.5 shadow-[0_16px_40px_-12px_rgba(13,148,136,.35)] dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="relative flex h-[13px] w-[13px] items-center justify-center">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-primary-400" />
                <Mic size={13} className="relative text-primary-600" />
              </span>
              <span className="text-xs font-semibold">Listening…</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-primary-50/40 px-6 py-20 sm:px-14 dark:bg-zinc-900/40">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Everything a first opinion needs</h2>
          <p className="mt-2.5 text-[15px] text-zinc-600 dark:text-zinc-400">
            No accounts, no paid tiers — every capability below runs on APIs that are free to use.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-primary-50 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="grad-bg mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white">
                <Icon size={19} />
              </div>
              <p className="text-[14.5px] font-bold">{title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-6 py-20 sm:px-14">
        <h2 className="font-serif mb-14 text-center text-2xl font-semibold sm:text-3xl">Three steps to an answer</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="grad-bg mb-4 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white">
                {s.n}
              </div>
              <p className="text-[15px] font-bold">{s.title}</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-500 dark:text-zinc-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 pb-16 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="grad-bg relative mx-auto flex max-w-6xl flex-col items-start gap-6 overflow-hidden rounded-[28px] p-10 sm:flex-row sm:items-center sm:justify-between sm:p-14"
        >
          <motion.div
            className="pointer-events-none absolute -top-28 right-16 h-[280px] w-[280px] rounded-full bg-white/10"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative">
            <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">Ready when you are.</h2>
            <p className="mt-2 text-sm text-primary-50">Free, private, and open source — see for yourself.</p>
          </div>
          <Link
            to="/chat"
            className="relative flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-[15px] font-bold text-primary-700"
          >
            Start a consultation <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col items-center justify-between gap-3 border-t border-primary-50 px-6 py-7 sm:flex-row sm:px-14 dark:border-zinc-900">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Educational demo only — not a real doctor, not a diagnosis.
        </p>
        <a
          href="https://github.com/shivshaktisahoo/AI-Medical-Chatbot"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400"
        >
          <GithubMark size={13} /> View source on GitHub
        </a>
      </footer>
    </div>
  );
}
