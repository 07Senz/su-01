"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";

function FormPillButton({
  label,
  active,
  onClick,
  className,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ||
        `px-4 py-2 text-xs font-extrabold rounded-xl transition-all shadow-sm border border-slate-200/70
        bg-gradient-to-r from-slate-200 via-slate-100 to-white hover:from-slate-300 hover:via-slate-150 hover:to-white text-slate-900`
      }
      style={
        active
          ? {
              backgroundImage:
                "linear-gradient(90deg, #cbd5e1 0%, #f8fafc 50%, #94a3b8 100%)",
            }
          : undefined
      }
    >
      {label}
    </button>
  );
}

type MemberType = "G.M" | "E.M" | "Core";

type MemberRecord = { id: string; password: string; memberType: MemberType };

function AdminPassForm({
  ADMIN_PASS,
  onSuccess,
  onBack,
}: {
  ADMIN_PASS: string;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        if (pass !== ADMIN_PASS) {
          setError("Incorrect Password");
          return;
        }
        onSuccess();
      }}
    >
      <input
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Admin Password"
        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
      />
      {error && (
        <div className="text-[11px] font-bold text-red-600">{error}</div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-3 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 px-3 py-3 bg-slate-950 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all"
        >
          Enter Admin
        </button>
      </div>
    </form>
  );
}

function MemberGateForm({
  members,
  onSuccess,
  onBack,
}: {
  members: MemberRecord[];
  onSuccess: (memberId: string) => void;
  onBack: () => void;
}) {
  const [formType, setFormType] = useState<MemberType>("Core");
  const [coreNum, setCoreNum] = useState("000");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const formId = useMemo(() => {
    if (formType === "Core") return `Core#${coreNum}`;
    return `${formType}#000`;
  }, [formType, coreNum]);

  const normalizedMembers = useMemo(() => {
    return members.map((m) => ({
      ...m,
      id: String(m.id).trim(),
      password: String(m.password),
    }));
  }, [members]);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);

        const match = normalizedMembers.find((m) => m.id === formId);
        if (!match) {
          setError("Incorrect Form Id");
          return;
        }
        if (match.password !== password) {
          setError("Incorrect Password");
          return;
        }
        onSuccess(match.id);
      }}
    >
      <div className="flex flex-wrap gap-2">
        <FormPillButton
          label="G.M"
          active={formType === "G.M"}
          onClick={() => setFormType("G.M")}
        />
        <FormPillButton
          label="E.M"
          active={formType === "E.M"}
          onClick={() => setFormType("E.M")}
        />
        <FormPillButton
          label="Core"
          active={formType === "Core"}
          onClick={() => setFormType("Core")}
        />
      </div>

      {formType === "Core" ? (
        <input
          inputMode="numeric"
          value={coreNum}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "");
            const trimmed = digits.slice(0, 3);
            setCoreNum(trimmed.padStart(3, "0"));
          }}
          placeholder="Core number"
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
        />
      ) : (
        <div className="text-[11px] text-slate-500 font-medium">
          Form ID will use <span className="font-bold">#000</span>
        </div>
      )}

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
      />

      <div className="text-[11px] font-bold text-slate-700">
        Form ID: <span className="text-slate-950">{formId}</span>
      </div>

      {error && (
        <div className="text-[11px] font-bold text-red-600">{error}</div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-3 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 px-3 py-3 bg-slate-950 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all"
        >
          Enter
        </button>
      </div>
    </form>
  );
}

function AdminPanelForm({
  members,
  setMembers,
  onLogout,
}: {
  members: MemberRecord[];
  setMembers: React.Dispatch<React.SetStateAction<MemberRecord[]>>;
  onLogout: () => void;
}) {
  type AdminSection = "Manage" | "Theme" | "Reset";
  const [section, setSection] = useState<AdminSection>("Manage");

  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Manage form fields (admin adds/updates member basic info)
  const [name, setName] = useState("");
  const [formId, setFormId] = useState("");
  const [batch, setBatch] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [other, setOther] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset password fields
  const [resetFormId, setResetFormId] = useState("");
  const [resetNewPass, setResetNewPass] = useState("");

  // IMPORTANT: current app stores only {id,password,memberType}
  // We keep the required UI/behavior, but persist name/batch/email/other into `memberType`-sidecar is not possible.
  // So for now we store those fields inside password string as JSON is unsafe.
  // To keep working login/auth, we store only pass+id (existing shape), and show placeholders in UI.

  return (
    <div className="py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono">
              ADMIN PANEL
            </div>
            <h2 className="text-3xl font-serif font-bold text-slate-950 mt-1">
              {section === "Manage"
                ? "Manage info"
                : section === "Theme"
                  ? "Theme"
                  : "Reset Password"}
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              {section === "Manage"
                ? "Add member basic information (no address)."
                : section === "Theme"
                  ? "Switch dark/light theme."
                  : "Reset member password by Form ID."}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm"
          >
            Logout
          </button>
        </div>

        <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-6">
          {/* PC hamburger-style section switch */}
          <div className="md:hidden flex items-center justify-between mb-5">
            <button
              type="button"
              className="px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-xl"
              onClick={() => {
                // rotate through sections on mobile
                setSection((prev) =>
                  prev === "Manage"
                    ? "Theme"
                    : prev === "Theme"
                      ? "Reset"
                      : "Manage",
                );
              }}
            >
              Sections: {section}
            </button>
          </div>

          <div className="hidden md:flex gap-3 mb-6">
            {(
              [
                { key: "Manage", label: "Manage info" },
                { key: "Theme", label: "Theme" },
                { key: "Reset", label: "Reset Password" },
              ] as const
            ).map((it) => (
              <button
                key={it.key}
                type="button"
                onClick={() => setSection(it.key)}
                className={
                  section === it.key
                    ? "px-4 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 text-white text-xs font-extrabold"
                    : "px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold"
                }
              >
                {it.label}
              </button>
            ))}
          </div>

          {section === "Manage" && (
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setError(null);

                if (!name.trim()) return setError("Name is required");
                if (!formId.trim()) return setError("Form ID is required");
                if (!batch.trim()) return setError("Batch is required");
                if (!email.trim()) return setError("Email is required");
                if (!pass.trim()) return setError("Password is required");

                // Persist into current auth storage shape
                const memberType: MemberType = "Core";
                setMembers((prev) => {
                  const exists = prev.some((m) => m.id === formId.trim());
                  if (exists) {
                    return prev.map((m) =>
                      m.id === formId.trim()
                        ? { ...m, password: pass.trim(), memberType }
                        : m,
                    );
                  }
                  return [
                    ...prev,
                    { id: formId.trim(), password: pass.trim(), memberType },
                  ];
                });

                // UI only: clear fields (basic info isn't stored in auth shape yet)
                setName("");
                setFormId("");
                setBatch("");
                setEmail("");
                setPass("");
                setOther("");
              }}
            >
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Name
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Form ID
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  placeholder="G.M#123 or E.M#123 or Core#123"
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Batch
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  placeholder="2026-xx"
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </div>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Set member password"
                />
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Other basic info
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  placeholder="Optional"
                />
              </div>

              <div className="md:col-span-2">
                {error && (
                  <div className="text-[11px] font-bold text-red-600 mb-3">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-xs font-extrabold rounded-xl hover:opacity-95 transition-all shadow-sm"
                >
                  Save member info
                </button>
              </div>
            </form>
          )}

          {section === "Theme" && (
            <div className="flex flex-col md:flex-row gap-4 md:items-start">
              <div className="flex-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Theme
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setThemeMode("dark")}
                    className={
                      themeMode === "dark"
                        ? "px-4 py-2 rounded-xl bg-slate-950 text-white text-xs font-extrabold"
                        : "px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50"
                    }
                  >
                    🌙 Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setThemeMode("light")}
                    className={
                      themeMode === "light"
                        ? "px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-extrabold"
                        : "px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50"
                    }
                  >
                    ☀️ Light
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 mt-4">
                  This UI toggles a local state. To fully theme the site, we
                  will wire it to global CSS next.
                </div>
              </div>
            </div>
          )}

          {section === "Reset" && (
            <form
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!resetFormId.trim()) return;
                if (!resetNewPass.trim()) return;
                setMembers((prev) =>
                  prev.map((m) =>
                    m.id === resetFormId.trim()
                      ? { ...m, password: resetNewPass.trim() }
                      : m,
                  ),
                );
                setResetNewPass("");
              }}
            >
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Form ID
                </div>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={resetFormId}
                  onChange={(e) => setResetFormId(e.target.value)}
                  placeholder="G.M#123"
                />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  New password
                </div>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  value={resetNewPass}
                  onChange={(e) => setResetNewPass(e.target.value)}
                  placeholder="New password"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-700 text-white text-xs font-extrabold rounded-xl hover:opacity-95 transition-all shadow-sm"
                >
                  Reset Password
                </button>
              </div>
            </form>
          )}

          {section === "Manage" && (
            <div className="mt-8">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Members stored (session)
              </div>
              <div className="space-y-2">
                {members.length === 0 ? (
                  <div className="text-xs text-slate-500 font-medium">
                    No members added yet.
                  </div>
                ) : (
                  members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-slate-100 bg-white"
                    >
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">
                          {m.id}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold">
                          Stored
                        </div>
                      </div>
                      <div className="text-[11px] font-bold text-slate-700">
                        • • • •
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Data Configurations
const coreTeam = [
  {
    name: "Tahrima Arafat",
    role: "Advisor",
    desc: "Guiding vision, standards, and strategy.",
  },
  {
    name: "Hasan Mahmud",
    role: "President",
    desc: "Leads the society and its executive team.",
  },
  {
    name: "Foyzul Islam Fahad",
    role: "Vice President",
    desc: "Operations and strategic delivery.",
  },
  {
    name: "Abu Tias",
    role: "Secretary",
    desc: "Governance, minutes, and communications.",
  },
  {
    name: "Shanto Kumar Sen",
    role: "Joint Secretary",
    desc: "Secretarial support and management.",
  },
  {
    name: "Sanjana Islam Suchi",
    role: "Public Relations",
    desc: "Voice, partnerships, and outreach.",
  },
  {
    name: "Raiyan Khan Rafid",
    role: "Coordinator",
    desc: "Cross-team coordination.",
  },
  {
    name: "Mahadi Mahmud",
    role: "Co-Coordinator",
    desc: "Supports coordination across teams.",
  },
  {
    name: "Md. Abu Ashfaq Sabbir",
    role: "Publication Secretary",
    desc: "Publications, journals, and editorial.",
  },
  {
    name: "Marvin Singh",
    role: "Treasurer",
    desc: "Financial stewardship and reporting.",
  },
  {
    name: "Golam Sarowar",
    role: "Project Manager",
    desc: "Delivery of society projects and events.",
  },
  {
    name: "Taslima Akter",
    role: "Researcher",
    desc: "Original research and knowledge creation.",
  },
];

const activitiesList = [
  {
    title: "Skill Development Workshops",
    desc: "Hands-on training across disciplines.",
  },
  {
    title: "Hospitality Training",
    desc: "Practical, industry-grade hospitality skills.",
  },
  {
    title: "Sports Tournaments",
    desc: "Competitive events that build teamwork.",
  },
  { title: "Leadership Development", desc: "From confidence to command." },
  {
    title: "Career & CV Workshops",
    desc: "Get interview-ready and hire-ready.",
  },
  {
    title: "Industry Expert Seminars",
    desc: "Learn directly from industry leaders.",
  },
  {
    title: "Networking Events",
    desc: "Meet the people who move your career forward.",
  },
  { title: "Team Building", desc: "Bond, communicate, deliver." },
  { title: "Volunteer & Community Service", desc: "Give back with purpose." },
  {
    title: "Project-Based Learning",
    desc: "Real projects, real teams, real impact.",
  },
  {
    title: "Research & Knowledge Sharing",
    desc: "Original inquiry, shared openly.",
  },
  {
    title: "Structured Study Groups",
    desc: "Structured, minuted, decision-focused.",
  },
  {
    title: "Communication & Public Speaking",
    desc: "Speak with clarity and command a room.",
  },
  { title: "Event Management Training", desc: "Plan, produce, deliver." },
  {
    title: "Innovation Challenges",
    desc: "Solve real problems under real constraints.",
  },
  { title: "Industry Collaborations", desc: "Work alongside professionals." },
];

const upcomingEvents = [
  {
    date: "NOVEMBER 15, 2026",
    title: "StepUp Leadership Summit 2026",
    desc: "A full-day summit with leaders from academia, industry, and public service.",
    time: "9:00 AM",
    location: "Main Auditorium, RUD",
    spots: 126,
    workshops: 12,
    days: 2,
  },
  {
    date: "DECEMBER 5, 2026",
    title: "Hospitality Skills Bootcamp",
    desc: "Three-day intensive bootcamp on modern hospitality operations.",
    time: "10:00 AM",
    location: "HMT Training Lab",
    spots: 45,
    workshops: 6,
    days: 3,
  },
  {
    date: "JANUARY 22, 2027",
    title: "Innovation Challenge - Winter Edition",
    desc: "48-hour challenge: real problems, real teams, real impact.",
    time: "2:00 PM",
    location: "Innovation Hub",
    spots: 80,
    workshops: 4,
    days: 2,
  },
];

const pastEvents = [
  {
    title: "Founding Ceremony",
    date: "JULY 10, 2026",
    desc: "The moment RUD StepUp Society of HMT officially came to life.",
  },
  {
    title: "Onboarding Workshop 1",
    date: "AUGUST 2, 2026",
    desc: "First cohort welcome and orientation.",
  },
];

const navItems = [
  "Home",
  "About",
  "Activities",
  "Events",
  "Leadership",
  "Gallery",
  "Research",
  "Achievements",
  "Join",
  "Contact",
  "Login",
];

const galleryCategories = [
  "All",
  "Workshops",
  "Sports",
  "Seminars",
  "Meetings",
  "Volunteer",
  "Hospitality",
];

const researchPapers = [
  {
    category: "HOSPITALITY JOURNALS • 2027",
    title: "Service Quality Determinants in University Hospitality",
    tags: ["SERVICE", "QUALITY"],
  },
  {
    category: "RESEARCH PAPERS • 2027",
    title: "Student Leadership Models: A Comparative Study",
    tags: ["LEADERSHIP"],
  },
  {
    category: "CASE STUDIES • 2026",
    title: "Event Management Case Study: Founding Ceremony",
    tags: ["EVENTS"],
  },
  {
    category: "WORKSHOP MATERIALS • 2026",
    title: "Workshop Handbook - Public Speaking",
    tags: ["SPEECH", "LEADERSHIP"],
  },
  {
    category: "EVENT REPORTS • 2026",
    title: "Annual Report 2026",
    tags: ["REPORT"],
  },
  {
    category: "STUDENT PUBLICATIONS • 2027",
    title: "Innovation Under Constraint",
    tags: ["INNOVATION"],
  },
];

const milestones = [
  {
    year: "2026",
    title: "Society Founded",
    desc: "Officially established at RUD on 10 July 2026.",
  },
  {
    year: "2026",
    title: "100+ Founding Members",
    desc: "Reached our founding cohort limits within weeks of launch.",
  },
  {
    year: "2026",
    title: "First Workshop Series",
    desc: "Delivered successful workshops across disciplines.",
  },
  {
    year: "2027",
    title: "Industry Partnerships",
    desc: "Signed MoUs with leading hospitality partners.",
  },
  {
    year: "2027",
    title: "First Research Publication",
    desc: "Published inaugural student research edition.",
  },
  {
    year: "2028",
    title: "Recognized Excellence",
    desc: "Awarded for student-led community engagement.",
  },
  {
    year: "FUTURE",
    title: "Regional Leadership",
    desc: "Recognized as a leading student society in Bangladesh.",
  },
];

const faqList = [
  {
    q: "Who can join?",
    a: "Any active student at the Royal University of Dhaka who holds a strong passion for hospitality, leadership, and personal skill refinement.",
  },
  {
    q: "Is there a membership fee?",
    a: "Membership updates and administrative frameworks are fully regularized by the executive board. Specific event resource access may vary.",
  },
  {
    q: "What is the time commitment?",
    a: "We expect a healthy baseline contribution of around 3-5 hours per week for core activities, allowing complete alignment with your academic schedules.",
  },
  {
    q: "Do I need prior experience?",
    a: "No prior structural experience is required! The society is deliberately built to train and guide you from foundational principles to master execution.",
  },
];

function MemberLoginForm({
  members,
  onBack,
  onSuccess,
}: {
  members: MemberRecord[];
  onBack: () => void;
  onSuccess: (memberId: string) => void;
}) {
  const [memberType, setMemberType] = useState<MemberType>("G.M");
  const [formIdNumber, setFormIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const formId = useMemo(() => {
    const digits = String(formIdNumber).replace(/\D/g, "");
    return `${memberType}#${digits}`;
  }, [memberType, formIdNumber]);

  const normalizedMembers = useMemo(() => {
    return members.map((m) => ({
      ...m,
      id: String(m.id).trim(),
      password: String(m.password),
    }));
  }, [members]);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2rem] p-8 w-full max-w-sm">
      <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">
        Member Login
      </h2>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <FormPillButton
          label="G.M"
          active={memberType === "G.M"}
          onClick={() => setMemberType("G.M")}
        />
        <FormPillButton
          label="E.M"
          active={memberType === "E.M"}
          onClick={() => setMemberType("E.M")}
        />
      </div>

      <div className="flex flex-col gap-3">
        <input
          value={formIdNumber}
          onChange={(e) => setFormIdNumber(e.target.value)}
          inputMode="numeric"
          placeholder="# number"
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
        />

        <div className="text-[11px] font-bold text-slate-700 text-center">
          Enter as: <span className="text-slate-950">{formId}</span>
        </div>

        {error && (
          <div className="text-[11px] font-bold text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-3 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              const match = normalizedMembers.find((m) => m.id === formId);
              if (!match) return setError("Incorrect Form Id");
              if (match.password !== password)
                return setError("Incorrect Password");
              onSuccess(match.id);
            }}
            className="flex-1 px-3 py-3 bg-slate-950 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminLoginForm({
  members,
  ADMIN_PASS,
  onBack,
  onSuccess,
}: {
  members: MemberRecord[];
  ADMIN_PASS: string;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [coreNumber, setCoreNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const formId = useMemo(() => {
    const digits = String(coreNumber).replace(/\D/g, "");
    return `Core#${digits}`;
  }, [coreNumber]);

  const normalizedMembers = useMemo(() => {
    return members.map((m) => ({
      ...m,
      id: String(m.id).trim(),
      password: String(m.password),
    }));
  }, [members]);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2rem] p-8 w-full max-w-sm">
      <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">
        Admin Login
      </h2>

      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <FormPillButton label="Core" active={true} onClick={() => {}} />
      </div>

      <div className="flex flex-col gap-3">
        <input
          value={coreNumber}
          onChange={(e) => setCoreNumber(e.target.value)}
          inputMode="numeric"
          placeholder="# number"
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
        />

        <div className="text-[11px] font-bold text-slate-700 text-center">
          Enter as: <span className="text-slate-950">{formId}</span>
        </div>

        {error && (
          <div className="text-[11px] font-bold text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-3 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              // allow initial admin credential via ADMIN_PASS if member entry missing
              if (password === ADMIN_PASS) return onSuccess();
              const match = normalizedMembers.find((m) => m.id === formId);
              if (!match) return setError("Incorrect Form Id");
              if (match.password !== password)
                return setError("Incorrect Password");
              onSuccess();
            }}
            className="flex-1 px-3 py-3 bg-slate-950 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppRouter() {
  const [activeTab, setActiveTab] = useState("Home");

  const [authedAdminId, setAuthedAdminId] = useState<string | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(null); // FAQ open index

  // Auth / gating
  type MemberType = "G.M" | "E.M" | "Core";
  type MemberRecord = { id: string; password: string; memberType: MemberType };

  // Stored only in-memory (no backend). Added via Admin panel.
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [authedMemberId, setAuthedMemberId] = useState<string | null>(null);
  const [authedAdmin, setAuthedAdmin] = useState(false);

  // Entry screen: choose who to login as.
  const [authMode, setAuthMode] = useState<"member" | "admin" | null>(null);

  const ADMIN_PASS = "123";

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans relative overflow-x-hidden selection:bg-emerald-100">
      {/* Navigation ... */}
      {/* GLOWING AMBIENT ACCENTS */}
      <div className="absolute top-[-5%] left-[-10%] w-[550px] h-[550px] bg-[#d1fae5]/40 rounded-full filter blur-[110px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[15%] right-[-10%] w-[600px] h-[600px] bg-[#fce7f3]/50 rounded-full filter blur-[100px] pointer-events-none mix-blend-multiply" />

      {/* HEADER NAVIGATION */}
      <nav className="w-full bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        {/* Desktop */}
        <div className="hidden md:flex justify-center items-center px-8 py-6">
          <div className="flex gap-2 group/nav">
            {navItems.map((item) => {
              const gradients = {
                Home: "hover:from-emerald-500 hover:to-emerald-600",
                About: "hover:from-blue-500 hover:to-indigo-500",
                Activities: "hover:from-orange-400 hover:to-pink-500",
                Events: "hover:from-purple-500 hover:to-violet-600",
                Leadership: "hover:from-rose-500 hover:to-red-600",
                Gallery: "hover:from-amber-400 hover:to-yellow-500",
                Research: "hover:from-teal-500 hover:to-cyan-600",
                Achievements: "hover:from-lime-500 hover:to-green-600",
                Join: "hover:from-fuchsia-500 hover:to-purple-600",
                Contact: "hover:from-slate-700 hover:to-slate-900",
                Login: "hover:from-slate-500 hover:to-blue-700",
              };

              return (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 text-sm font-extrabold tracking-wide 
                    ${
                      activeTab === item
                        ? "text-white bg-gradient-to-r from-slate-400 to-slate-600"
                        : `text-slate-600 hover:text-white bg-transparent ${
                            gradients[item as keyof typeof gradients] ||
                            "hover:from-slate-500 hover:to-slate-600"
                          } hover:bg-gradient-to-r`
                    }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: hamburger + dropdown */}
        <div className="md:hidden flex items-center justify-between px-4 py-4">
          <button
            type="button"
            aria-label="Open navigation"
            className="p-2 rounded-lg bg-white/60 hover:bg-white transition-colors border border-slate-100"
            onClick={() => {
              const el = document.getElementById("mobile-nav");
              if (!el) return;
              const open = el.getAttribute("data-open") === "true";
              el.setAttribute("data-open", open ? "false" : "true");
            }}
          >
            <span className="block w-5 h-[2px] bg-slate-800 mb-1 rounded-full" />
            <span className="block w-5 h-[2px] bg-slate-800 mb-1 rounded-full" />
            <span className="block w-5 h-[2px] bg-slate-800 rounded-full" />
          </button>

          <div className="text-xs font-extrabold tracking-widest text-slate-700 px-2">
            {activeTab}
          </div>

          <div className="w-9" />
        </div>

        <div
          id="mobile-nav"
          data-open="false"
          className="md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out max-h-0"
        >
          <div className="px-4 pb-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const gradients = {
                  Home: "hover:from-emerald-500 hover:to-emerald-600",
                  About: "hover:from-blue-500 hover:to-indigo-500",
                  Activities: "hover:from-orange-400 hover:to-pink-500",
                  Events: "hover:from-purple-500 hover:to-violet-600",
                  Leadership: "hover:from-rose-500 hover:to-red-600",
                  Gallery: "hover:from-amber-400 hover:to-yellow-500",
                  Research: "hover:from-teal-500 hover:to-cyan-600",
                  Achievements: "hover:from-lime-500 hover:to-green-600",
                  Join: "hover:from-fuchsia-500 hover:to-purple-600",
                  Contact: "hover:from-slate-700 hover:to-slate-900",
                  Login: "hover:from-slate-500 hover:to-blue-700",
                };

                return (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveTab(item);
                      const el = document.getElementById("mobile-nav");
                      if (!el) return;
                      el.setAttribute("data-open", "false");
                    }}
                    className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-300 text-sm font-extrabold tracking-wide border border-slate-100
                      ${
                        activeTab === item
                          ? "text-white bg-gradient-to-r from-slate-400 to-slate-600 border-transparent"
                          : `text-slate-700 hover:text-white bg-white hover:bg-gradient-to-r ${
                              gradients[item as keyof typeof gradients] ||
                              "hover:from-slate-500 hover:to-slate-600"
                            }`
                      }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Toggle mobile nav max-height (imperative to avoid extra state) */}
      <style jsx>{`
        #mobile-nav[data-open="true"] {
          max-height: 420px;
        }
      `}</style>

      {/* DYNAMIC TAB CONTROLLER */}

      {/* LOGIN FIRST: show login section before Home when not authed */}
      {!authedMemberId && !authedAdmin && activeTab === "Home" && (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2rem] p-8 w-full max-w-md">
            <h2 className="text-2xl font-black text-slate-900 mb-3 text-center">
              Login
            </h2>
            <p className="text-xs text-slate-500 text-center mb-6 font-medium">
              Choose access.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("MemberLogin")}
                className="px-5 py-3 bg-gradient-to-r from-slate-200 via-slate-100 to-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:shadow-md transition-all"
              >
                Member Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("AdminLogin")}
                className="px-5 py-3 bg-gradient-to-r from-slate-900 to-slate-700 border border-slate-900 text-white text-xs font-bold rounded-xl hover:opacity-95 transition-all"
              >
                Admin Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member/Admin Login screens (2 fields) */}
      {!authedMemberId && !authedAdmin && activeTab === "MemberLogin" && (
        <div className="flex justify-center items-center py-20 px-6">
          <MemberLoginForm
            members={members}
            onBack={() => setActiveTab("Home")}
            onSuccess={(memberId) => {
              setAuthedMemberId(memberId);
              setActiveTab("Home");
            }}
          />
        </div>
      )}

      {!authedMemberId && !authedAdmin && activeTab === "AdminLogin" && (
        <div className="flex justify-center items-center py-20 px-6">
          <AdminLoginForm
            onBack={() => setActiveTab("Home")}
            members={members}
            ADMIN_PASS="123"
            onSuccess={() => {
              setAuthedAdmin(true);
              setActiveTab("Admin");
            }}
          />
        </div>
      )}

      {authedAdmin && activeTab === "Admin" && (
        <AdminPanelForm
          members={members}
          setMembers={setMembers}
          onLogout={() => {
            setAuthedAdmin(false);
            setAuthedMemberId(null);
            setAuthMode(null);
            setActiveTab("Home");
          }}
        />
      )}

      {/* Gated website */}
      {authedMemberId === null &&
        !authedAdmin &&
        activeTab !== "Home" &&
        activeTab !== "MemberLogin" &&
        activeTab !== "AdminLogin" && <div className="hidden" />}

      {/* 1. HOME TAB */}
      {activeTab === "Home" && (
        <div>
          {/* Reduced padding (pt/pb) to keep elements close */}
          <header className="relative pt-2 pb-2 flex flex-col items-center justify-center px-6 text-center z-10 max-w-4xl mx-auto">
            {/* Used bracket syntax for custom large size: w-[400px] h-[400px] */}
            {/* Removed mb-5 (set to mb-0) to eliminate the gap */}
            <div className="w-64 h-64 md:w-[400px] md:h-[400px] mb-0 flex items-center justify-center">
              <Image
                src="/Logo0.png"
                alt="RUD StepUp Logo"
                width={1000}
                height={1000}
                className="w-full h-full object-contain transition-transform duration-300 ease-in-out hover:scale-[2.5] cursor-pointer"
                priority
              />
            </div>

            {/* Set margin-bottom to 0 to keep it tight to the elements below */}
            <div className="inline-flex items-center px-6 py-2 bg-slate-900 text-white text-xs font-bold tracking-widest rounded-full mb-6 shadow-sm">
              ESTABLISHED 10 JULY 2026
            </div>

            <h1 className="text-4xl md:text-6xl font-serif text-[#0b1b3d] font-black tracking-tight mb-4 leading-[1.15]">
              RUD StepUp Society of HMT
            </h1>
            <p className="text-slate-600 text-sm md:text-base font-medium mb-8 max-w-2xl">
              Empowering students through skill development, leadership,
              innovation, collaboration, and meaningful experiences.
            </p>

            <div className="flex gap-3 justify-center items-center">
              {/* Button 1: Apply Now Button */}
              <button
                onClick={() => setActiveTab("Join")}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
              >
                Apply Now <span>→</span>
              </button>

              {/* Button 2: Explore Activities */}
              <button
                onClick={() => setActiveTab("Activities")}
                className="px-5 py-2.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-900 hover:text-white transition-all"
              >
                Explore Activities
              </button>
            </div>

            {/* Interactive Scroll Indicator (Clickable) */}
            <div
              className="mt-20 flex justify-center cursor-pointer group z-50 relative transition-transform duration-300 hover:scale-110"
              onClick={() => {
                document
                  .getElementById("metrics-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <img
                src="/Logo0.png"
                alt="Scroll down"
                className="w-32 h-32 object-contain opacity-50 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          </header>

          {/* Glassmorphism Metrics Banner */}
          <section
            id="metrics-section"
            className="max-w-5xl mx-auto px-6 py-10 mt-10 scroll-mt-20"
          >
            <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-8 grid grid-cols-2 md:grid-cols-6 gap-6">
              <div>
                <h3 className="text-2xl font-black text-[#0b1b3d]">15+</h3>
                <p className="text-[10px] font-bold tracking-wider text-slate-600 uppercase mt-0.5">
                  Members
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#0b1b3d]">0+</h3>
                <p className="text-[10px] font-bold tracking-wider text-slate-600 uppercase mt-0.5">
                  Workshops
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#0b1b3d]">0+</h3>
                <p className="text-[10px] font-bold tracking-wider text-slate-600 uppercase mt-0.5">
                  Seminars
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#0b1b3d]">1+</h3>
                <p className="text-[10px] font-bold tracking-wider text-slate-600 uppercase mt-0.5">
                  Events
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#0b1b3d]">0+</h3>
                <p className="text-[10px] font-bold tracking-wider text-slate-600 uppercase mt-0.5">
                  Gallery
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-black text-[#0b1b3d]">0+</h3>
                <p className="text-[10px] font-bold tracking-wider text-slate-600 uppercase mt-0.5">
                  Research
                </p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 2. ABOUT TAB */}
      {activeTab === "About" && (
        <section className="py-16 max-w-4xl mx-auto px-6">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono">
            Our Vision
          </span>
          <h2 className="text-3xl font-serif font-bold text-slate-950 mt-1 mb-6">
            A society that grows leaders &mdash; not just members.
          </h2>
          <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3">
            {/* Now your content will stack on phones (1 column) and spread out on PCs (3 columns) */}
            <div>
              <p>
                We help students learn new skills, build confidence, create
                professional habits, and foster positive change through
                structured group activities, sports, research, networking, and
                leadership programs.
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  16+ activities
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  across every single discipline
                </p>
              </div>
              <button
                onClick={() => setActiveTab("Activities")}
                className="px-3 py-1 bg-white border border-slate-200 text-[11px] font-bold rounded-full"
              >
                Explore
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-12">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CORE VALUES
            </span>
            <h3 className="text-xl font-bold text-slate-950 mt-1 mb-6">
              What we stand for
            </h3>
            <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3">
              {[
                "Leadership",
                "Innovation",
                "Professionalism",
                "Integrity",
                "Collaboration",
                "Growth",
              ].map((val) => (
                <div
                  key={val}
                  className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm"
                >
                  <h4 className="font-bold text-slate-900 text-xs mb-1">
                    ✦ {val}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Upholding highest structural metrics daily.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. ACTIVITIES TAB */}
      {activeTab === "Activities" && (
        <section className="py-16 max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono">
              WHAT WE DO
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-950 mt-1">
              Sixteen ways to grow.
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              From skill workshops to research to sports — pick the paths that
              match your ambition.
            </p>
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3">
            {activitiesList.map((item, index) => (
              <div
                key={index}
                className="p-5 border border-slate-100 rounded-xl bg-white hover:border-slate-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-xs mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
                <button className="text-[10px] font-bold text-emerald-700 mt-4 text-left hover:underline">
                  Learn more →
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. EVENTS TAB */}
      {activeTab === "Events" && (
        <section className="py-16 max-w-4xl mx-auto px-6">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono">
                EVENTS
              </span>
              <h2 className="text-3xl font-serif font-bold text-slate-950 mt-1">
                What’s happening at RUD StepUp.
              </h2>
            </div>
            <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-full hover:bg-slate-100 transition-all">
              Full calendar
            </button>
          </div>

          <div className="space-y-4 mb-12">
            {upcomingEvents.map((evt, idx) => (
              <div
                key={idx}
                className="p-6 border border-slate-100 rounded-2xl bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm transition-all"
              >
                <div className="max-w-xl">
                  <span className="text-[9px] font-bold text-emerald-600 tracking-wider block mb-1">
                    {evt.date}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">
                    {evt.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    {evt.desc}
                  </p>
                  <div className="flex gap-4 text-[10px] text-slate-400 font-medium mt-3">
                    <span>🕒 {evt.time}</span>
                    <span>📍 {evt.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex gap-3 text-center">
                    <div className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md">
                      <span className="block text-xs font-black text-slate-800">
                        {evt.spots}
                      </span>
                      <span className="text-[8px] text-slate-400 uppercase font-bold">
                        Spots
                      </span>
                    </div>
                    <div className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-md">
                      <span className="block text-xs font-black text-slate-800">
                        {evt.workshops}
                      </span>
                      <span className="text-[8px] text-slate-400 uppercase font-bold">
                        Wrkshps
                      </span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              PAST EVENTS
            </h3>
            <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3">
              {pastEvents.map((pe, idx) => (
                <div
                  key={idx}
                  className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl"
                >
                  <span className="text-[9px] font-bold text-slate-400 block mb-0.5">
                    {pe.date}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">
                    {pe.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-normal mb-3">
                    {pe.desc}
                  </p>
                  <button
                    onClick={() => setActiveTab("Gallery")}
                    className="text-[10px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    View gallery <span>→</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. LEADERSHIP TAB */}
      {activeTab === "Leadership" && (
        <section className="py-16 max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-mono">
              LEADERSHIP
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-950 mt-1">
              The core team
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Led by students, for students. Shaping the vision, direction, and
              daily life of the society.
            </p>
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3">
            {coreTeam.map((member, index) => (
              <div
                key={index}
                className="p-5 border border-slate-100 rounded-xl bg-white hover:border-slate-200 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[9px] text-emerald-700 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded">
                      {member.role}
                    </span>
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] cursor-pointer text-slate-400 hover:text-slate-600">
                        🔗
                      </span>
                      <span className="text-[10px] cursor-pointer text-slate-400 hover:text-slate-600">
                        ✉️
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                    {member.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">
                    {member.desc}
                  </p>
                </div>
                <div className="text-[10px] text-slate-300 font-medium mt-6 pt-2.5 border-t border-slate-50">
                  Royal University of Dhaka
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. GALLERY TAB */}
      {activeTab === "Gallery" && (
        <section className="py-16 max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-pink-600 font-mono">
              GALLERY
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-950 mt-1">
              Every step, captured.
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Browse our moments by audition, session, or tournament fields.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {galleryCategories.map((cat, i) => (
              <button
                key={i}
                className={`px-3 py-1 text-xs font-semibold rounded-full border ${i === 0 ? "bg-slate-950 text-white border-slate-950" : "bg-white text-slate-500 border-slate-200 hover:text-slate-800"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((img) => (
              <div
                key={img}
                className="aspect-square bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden group cursor-pointer shadow-inner flex items-center justify-center"
              >
                <span className="text-slate-300 text-xs font-semibold group-hover:text-slate-500 transition-colors">
                  Capture Asset #{img}
                </span>
                <div className="absolute inset-0 bg-slate-950/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-[9px] text-white font-bold tracking-wider uppercase bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                    RUD Session
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. RESEARCH TAB */}
      {activeTab === "Research" && (
        <section className="py-16 max-w-4xl mx-auto px-6">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono">
                KNOWLEDGE
              </span>
              <h2 className="text-3xl font-serif font-bold text-slate-950 mt-1">
                Research & Journals.
              </h2>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Original student inquiry, hospitality journals, workshop
                materials, and case studies.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search publications..."
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
              />
              <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg">
                Filter
              </button>
            </div>
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3">
            {researchPapers.map((paper, idx) => (
              <div
                key={idx}
                className="p-5 border border-slate-100 bg-white rounded-xl shadow-sm hover:border-slate-200 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-[9px] font-bold text-slate-400 block mb-1">
                    {paper.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-xs md:text-sm group-hover:text-emerald-700 transition-colors leading-snug">
                    {paper.title}
                  </h3>
                </div>
                <div className="flex gap-1.5 mt-5">
                  {paper.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[8px] font-extrabold tracking-wider uppercase text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. ACHIEVEMENTS TAB */}
      {activeTab === "Achievements" && (
        <section className="py-16 max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 font-mono">
              ACHIEVEMENTS
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-950 mt-1">
              Milestones that made us.
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              A growing record of successful events, collaborations, awards, and
              publications.
            </p>
          </div>

          <div className="space-y-6 border-l border-slate-100 pl-6 ml-4 relative">
            {milestones.map((ms, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute left-[-31px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 group-hover:bg-emerald-600 transition-colors border-2 border-white" />
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded block w-max mb-1">
                  {ms.year}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{ms.title}</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-relaxed">
                  {ms.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. JOIN TAB */}
      {activeTab === "Join" && (
        <section className="py-16 max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono">
              MEMBERSHIP
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-950 mt-1">
              Become a member. Step up.
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-medium">
              Join a community of driven students building skills, lead network,
              and grow.
            </p>
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3">
            {/* Now your content will stack on phones (1 column) and spread out on PCs (3 columns) */}
            <div className="space-y-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-4">
                REQUIREMENTS
              </span>
              <ul className="space-y-2 text-xs text-slate-600 font-medium mb-8">
                <li className="flex items-center gap-2">
                  ✓ Current student at Royal University of Dhaka
                </li>
                <li className="flex items-center gap-2">
                  ✓ Good academic standing
                </li>
                <li className="flex items-center gap-2">
                  ✓ Willing to commit 3-5 hours per week
                </li>
                <li className="flex items-center gap-2">
                  ✓ Aligned with our values: leadership, integrity, growth
                </li>
              </ul>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-4">
                FAQ
              </span>
              <div className="space-y-2">
                {faqList.map((faq, fIdx) => (
                  <div key={fIdx} className="border-b border-slate-100 pb-2">
                    <button
                      onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                      className="w-full text-left flex justify-between items-center text-xs font-bold text-slate-700 py-1"
                    >
                      <span>{faq.q}</span>
                      <span>{openFaq === fIdx ? "−" : "+"}</span>
                    </button>
                    {openFaq === fIdx && (
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1 pl-1">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl shadow-inner">
              <h3 className="font-bold text-slate-900 text-sm mb-4">
                Membership application
              </h3>
              <form
                className="space-y-3.5"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 shadow-sm"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 shadow-sm"
                    placeholder="2026-xxx-xxx"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 shadow-sm"
                    placeholder="name@domain.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 shadow-sm"
                    placeholder="HMT / BBA"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Why do you want to join?
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 shadow-sm resize-none"
                    placeholder="Share your ambition with the board..."
                  />
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 bg-slate-950 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm"
                >
                  Submit application
                </button>
              </form>
              <p className="text-[9px] text-center text-slate-400 mt-4 font-medium">
                A working member portal with review and approval flows will be
                enabled once Lovable Cloud is turned on.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 10. CONTACT TAB */}
      {activeTab === "Contact" && (
        <section className="py-16 max-w-4xl mx-auto px-6">
          <div className="mb-10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 font-mono">
              CONTACT
            </span>
            <h2 className="text-3xl font-serif font-bold text-slate-950 mt-1">
              Let&amp;apos;s talk.
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Questions, collaborations, or media enquiries — we&amp;apos;re
              here.
            </p>
          </div>

          <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-3">
            {/* Now your content will stack on phones (1 column) and spread out on PCs (3 columns) */}
            <div className="space-y-6">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                  EMAIL
                </span>
                <a
                  href="mailto:rudstepup@gmail.com"
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  rudstepup@gmail.com
                </a>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                  FACEBOOK
                </span>
                <a
                  href="#"
                  className="text-xs font-bold text-slate-800 hover:underline"
                >
                  Official Page
                </a>
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">
                  ADDRESS
                </span>
                <p className="text-xs font-bold text-slate-800 leading-normal">
                  Plot 404, Channel 24 Road, Dhaka 1208
                </p>
              </div>

              <div className="w-full h-44 bg-slate-50 border border-slate-200/60 rounded-xl flex flex-col items-center justify-center text-center px-4 shadow-inner">
                <span className="text-slate-400 text-xs font-bold">
                  Interactive Map Grid View
                </span>
                <p className="text-[10px] text-slate-300 mt-1 font-medium">
                  Use ctrl + scroll to zoom the map
                </p>
              </div>
            </div>

            <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm">
              <h3 className="font-bold text-slate-900 text-xs mb-4 uppercase tracking-wider">
                Send us a message
              </h3>
              <form
                className="space-y-3.5"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                />
                <textarea
                  rows={4}
                  placeholder="Message"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 resize-none"
                />
                <button
                  type="button"
                  className="px-5 py-2 bg-slate-950 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all shadow-sm"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-10 bg-slate-50/40">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row justify-between                    items-start gap-4 text-[11px] font-medium">
          <p className="text-left text-red-500">
            © 2026 RUD StepUp Society of HMT. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
