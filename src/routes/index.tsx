import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TechConnect 2026 — Discover sessions. Build your schedule. Meet your community." },
      { name: "description", content: "TechConnect 2026 conference app. Browse the session catalog, build your personal schedule, and meet your community." },
      { property: "og:title", content: "TechConnect 2026 — Discover sessions. Build your schedule. Meet your community." },
      { property: "og:description", content: "TechConnect 2026 conference app. Browse the session catalog, build your personal schedule, and meet your community." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Session = {
  id: string;
  title: string;
  speaker: string;
  time: string;
  room: string;
  tags: string[];
};

const SESSIONS: Session[] = [
  {
    id: "s1",
    title: "The Next Decade of AI Infrastructure",
    speaker: "Sofia Marchetti",
    time: "09:00",
    room: "Main Stage",
    tags: ["AI", "Cloud"],
  },
  {
    id: "s2",
    title: "Leading Through Deep Uncertainty",
    speaker: "Dr. Elena Vasquez",
    time: "09:45",
    room: "Room A",
    tags: ["Leadership", "Strategy"],
  },
  {
    id: "s3",
    title: "Rust in Production: A Field Guide",
    speaker: "Tomas Lindqvist",
    time: "10:30",
    room: "Room B",
    tags: ["Rust", "Systems"],
  },
  {
    id: "s4",
    title: "Designing APIs People Actually Love",
    speaker: "Sam Whitfield",
    time: "11:15",
    room: "Workshop Lab",
    tags: ["APIs", "DX"],
  },
  {
    id: "s5",
    title: "Observability on a Shoestring Budget",
    speaker: "Ravi Menon",
    time: "12:00",
    room: "Room A",
    tags: ["SRE", "Ops"],
  },
  {
    id: "s6",
    title: "On-Call Culture Without the Burnout",
    speaker: "Fatima Al-Rashid",
    time: "13:00",
    room: "Main Stage",
    tags: ["Culture", "SRE"],
  },
  {
    id: "s7",
    title: "The Async Organization",
    speaker: "Grace Kim",
    time: "13:45",
    room: "Room B",
    tags: ["Leadership", "Remote"],
  },
  {
    id: "s8",
    title: "Prompting with Judgment",
    speaker: "Elena Petrova",
    time: "14:30",
    room: "Workshop Lab",
    tags: ["AI", "Craft"],
  },
  {
    id: "s9",
    title: "The Cost of Every Query",
    speaker: "Priya Nair",
    time: "15:15",
    room: "Room A",
    tags: ["Data", "FinOps"],
  },
  {
    id: "s10",
    title: "Shipping in Public",
    speaker: "Sofia Martins",
    time: "16:00",
    room: "Main Stage",
    tags: ["Product", "Growth"],
  },
  {
    id: "s11",
    title: "Building with Open Source",
    speaker: "Nadia Haddad",
    time: "16:45",
    room: "Room B",
    tags: ["Community", "Governance"],
  },
  {
    id: "s12",
    title: "Designing for Trust",
    speaker: "Marcus Bell",
    time: "17:30",
    room: "Workshop Lab",
    tags: ["UX", "Ethics"],
  },
];

function formatTime(time: string) {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
}

function Index() {
  const [activeView, setActiveView] = useState<"catalog" | "schedule">("catalog");
  const [scheduledIds, setScheduledIds] = useState<Set<string>>(new Set());

  const toggleSession = (id: string) => {
    setScheduledIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const scheduledSessions = useMemo(() => {
    return SESSIONS.filter((s) => scheduledIds.has(s.id)).sort((a, b) =>
      a.time.localeCompare(b.time)
    );
  }, [scheduledIds]);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/30">
      <Header
        activeView={activeView}
        onChangeView={setActiveView}
        savedCount={scheduledIds.size}
      />

      <Hero />

      {activeView === "catalog" ? (
        <CatalogView sessions={SESSIONS} scheduledIds={scheduledIds} onToggle={toggleSession} />
      ) : (
        <ScheduleView sessions={scheduledSessions} onToggle={toggleSession} />
      )}

      <Footer />
    </div>
  );
}

function Header({
  activeView,
  onChangeView,
  savedCount,
}: {
  activeView: "catalog" | "schedule";
  onChangeView: (view: "catalog" | "schedule") => void;
  savedCount: number;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="grid size-8 place-items-center rounded-md bg-gradient-to-br from-surface-2 to-background ring-1 ring-white/15">
            <span className="font-display font-bold text-sm text-primary">T</span>
          </div>
          <div className="leading-none">
            <div className="font-display text-card font-semibold tracking-tight">
              TechConnect <span className="font-mono text-xs text-faint">2026</span>
            </div>
            <div className="mt-1 font-mono text-label tracking-wide text-muted">
              Discover. Build. Meet.
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-1 rounded-full bg-surface p-1 ring-1 ring-white/10">
          <button
            onClick={() => onChangeView("catalog")}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors duration-200 ${
              activeView === "catalog"
                ? "bg-surface-2 text-foreground ring-1 ring-white/10"
                : "text-muted hover:text-foreground"
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => onChangeView("schedule")}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition-colors duration-200 ${
              activeView === "schedule"
                ? "bg-surface-2 text-foreground ring-1 ring-white/10"
                : "text-muted hover:text-foreground"
            }`}
          >
            My Schedule
            {savedCount > 0 && (
              <span className="grid size-5 place-items-center rounded-full bg-primary text-micro font-semibold text-primary-foreground pop">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <span className="font-mono text-label text-muted">
            {savedCount} saved
          </span>
          <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-primary/40 to-surface-2 text-label font-mono text-primary ring-1 ring-white/15">
            AK
          </div>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-glow-h w-glow-w -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="flex items-center gap-3 font-mono text-label uppercase tracking-eyebrow text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          Live Program — 12 Sessions
        </div>
        <h1 className="mt-5 max-w-hero text-balance font-display text-5xl font-bold tracking-tight sm:text-6xl">
          Discover sessions. Build your schedule.{" "}
          <span className="text-primary">Meet your community.</span>
        </h1>
        <p className="mt-5 max-w-prose-narrow text-balance text-lg text-muted">
          A live-built agenda for the 2026 developer &amp; leadership track. Curate the
          sessions that matter to you — your plan assembles itself in real time.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <a
            href="#catalog"
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
          >
            Explore the catalog
          </a>
          <div className="flex items-center gap-6 font-mono text-label text-muted">
            <span>
              <span className="text-foreground">02</span> Days
            </span>
            <span>
              <span className="text-foreground">12</span> Sessions
            </span>
            <span>
              <span className="text-foreground">04</span> Tracks
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CatalogView({
  sessions,
  scheduledIds,
  onToggle,
}: {
  sessions: Session[];
  scheduledIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <main id="catalog" className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Session catalog
          </h2>
          <p className="mt-1 text-sm text-muted">Tap add to build your personal run of show.</p>
        </div>
        <span className="font-mono text-label text-faint">01 / CATALOG</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session, index) => (
          <SessionCard
            key={session.id}
            session={session}
            isScheduled={scheduledIds.has(session.id)}
            onToggle={() => onToggle(session.id)}
            index={index}
          />
        ))}
      </div>
    </main>
  );
}

function SessionCard({
  session,
  isScheduled,
  onToggle,
  index,
}: {
  session: Session;
  isScheduled: boolean;
  onToggle: () => void;
  index: number;
}) {
  const delay = Math.min(index * 60, 600);

  return (
    <article
      className="group relative rounded-2xl bg-gradient-to-b from-surface-2 to-surface p-5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-primary/40 rise"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between font-mono text-label">
        <span className="text-primary">{formatTime(session.time)}</span>
        <span className="text-faint">{session.room}</span>
      </div>
      <h3 className="mt-3 text-balance font-display text-lg font-semibold leading-snug tracking-tight">
        {session.title}
      </h3>
      <p className="mt-1.5 text-sm text-muted">{session.speaker}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {session.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-label text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
      <button
        onClick={onToggle}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold ring-1 transition-colors duration-200 ${
          isScheduled
            ? "bg-primary text-primary-foreground ring-primary/25 hover:bg-primary/90"
            : "bg-primary/10 text-primary ring-primary/25 hover:bg-primary hover:text-primary-foreground"
        }`}
      >
        <span className="grid size-4 place-items-center text-base leading-none">
          {isScheduled ? "✓" : "+"}
        </span>
        {isScheduled ? "Added" : "Add to Schedule"}
      </button>
    </article>
  );
}

function ScheduleView({
  sessions,
  onToggle,
}: {
  sessions: Session[];
  onToggle: (id: string) => void;
}) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              My Schedule
            </h2>
            <p className="mt-1 text-sm text-muted">Sorted by time. This is your plan, live.</p>
          </div>
          <span className="font-mono text-label text-faint">02 / SCHEDULE</span>
        </div>

        {sessions.length === 0 ? (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-2 to-surface ring-1 ring-white/10 px-5 py-12 text-center">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <p className="font-display text-lg font-semibold text-foreground">
              Your schedule is empty
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Browse the catalog and add sessions to build your personal agenda.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
            >
              Explore catalog
            </button>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-surface-2 to-surface ring-1 ring-white/10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <ol className="divide-y divide-white/5">
              {sessions.map((session, index) => (
                <li
                  key={session.id}
                  className="flex items-center gap-4 px-5 py-4 rise"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <span className="w-14 shrink-0 font-mono text-sm text-primary">
                    {formatTime(session.time)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-card font-medium tracking-tight text-balance">
                      {session.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {session.speaker} · {session.room}
                    </p>
                  </div>
                  <span className="hidden font-mono text-micro uppercase tracking-widest text-faint sm:inline">
                    {session.tags[0]}
                  </span>
                  <button
                    onClick={() => onToggle(session.id)}
                    className="px-1 text-lg leading-none text-faint transition-colors duration-200 hover:text-primary"
                    aria-label={`Remove ${session.title} from schedule`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-6 py-8 sm:flex-row sm:items-center">
        <span className="font-display text-sm font-semibold tracking-tight">
          TechConnect <span className="font-mono text-xs text-faint">2026</span>
        </span>
        <span className="font-mono text-label text-faint">
          A live-built event agenda · Mar 14–15, 2026
        </span>
      </div>
    </footer>
  );
}
