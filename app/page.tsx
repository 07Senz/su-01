"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "./auth/AuthContext";
import AdminLoginForm from "./components/auth/AdminLoginForm";
import AdminPanelForm from "./components/auth/AdminPanelForm";
import MemberLoginForm from "./components/auth/MemberLoginForm";

export default function AppRouter() {
  const {
    authedAdmin,
    setAuthedAdmin,
    setAuthedAdminId,
    authedMemberId,
    setAuthedMemberId,
    members,
    setMembers,
  } = useAuth();

  const [authMode, setAuthMode] = useState<"member" | "admin" | null>(null);
  const [activeTab, setActiveTab] = useState("Login");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/members", { method: "GET" });
        const data = await res.json().catch(() => null);
        if (Array.isArray(data?.members)) setMembers(data.members);
      } catch {
        // ignore
      }
    })();
  }, [setMembers]);


  const handleLogout = () => {
    setAuthedAdmin(false);
    setAuthedAdminId(null);
    setAuthedMemberId(null);
    setAuthMode(null);
    setActiveTab("Login");
  };

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans relative overflow-x-hidden selection:bg-emerald-100">
      <div className="absolute top-[-5%] left-[-10%] w-[550px] h-[550px] bg-[#d1fae5]/40 rounded-full filter blur-[110px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[15%] right-[-10%] w-[600px] h-[600px] bg-[#fce7f3]/50 rounded-full filter blur-[100px] pointer-events-none mix-blend-multiply" />

      <nav className="w-full bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 md:px-8 py-4">
          <div className="text-xs md:text-sm font-extrabold tracking-widest text-slate-700 px-2">
            {activeTab}
          </div>
          <button
            type="button"
            onClick={() => {
              setAuthMode(null);
              setActiveTab("Login");
            }}
            className={`px-4 h-11 flex items-center justify-center rounded-2xl text-xs font-extrabold tracking-wide transition-all shadow-sm
              ${activeTab === "Login" ? "text-white bg-gradient-to-r from-slate-500 to-blue-700" : "text-slate-700 bg-white/30 border border-white/50 backdrop-blur-xl hover:bg-white/40"}`}
          >
            Login
          </button>
        </div>
      </nav>

      {!authedMemberId && !authedAdmin && activeTab === "Login" && (
        <div className="flex justify-center items-center py-20 px-6">
          {authMode === null && (
            <div className="bg-white/80 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2rem] p-8 w-full max-w-sm flex flex-col gap-3">
              <h2 className="text-2xl font-black text-slate-900 mb-3 text-center">
                Login as
              </h2>
              <button
                type="button"
                onClick={() => setAuthMode("member")}
                className="w-full px-3 py-3 bg-slate-950 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-all"
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("admin")}
                className="w-full px-3 py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-all"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("Home")}
                className="w-full px-3 py-2 text-slate-400 text-[11px] font-bold hover:text-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          )}

          {authMode === "member" && (
            <MemberLoginForm
              members={members}
              onBack={() => setAuthMode(null)}
              onSuccess={(memberId) => {
                setAuthedMemberId(memberId);
                setAuthMode(null);
                setActiveTab("Home");
              }}
            />
          )}

          {authMode === "admin" && (
            <AdminLoginForm
              onBack={() => setAuthMode(null)}
              onSuccess={() => {
                setAuthedAdmin(true);
                setAuthedAdminId("admin");
                setAuthMode(null);
                setActiveTab("Admin");
              }}
            />
          )}
        </div>
      )}

      {authedAdmin && activeTab === "Admin" && (
        <AdminPanelForm
          members={members}
          setMembers={setMembers}
          onLogout={handleLogout}
        />
      )}

      {/* Simple public home to keep UI alive */}
      {activeTab === "Home" && (
        <div className="px-6 py-12 max-w-4xl mx-auto relative z-10">
          <header className="flex flex-col items-center text-center gap-6">
            <div className="w-64 h-64 md:w-[280px] md:h-[280px] flex items-center justify-center">
              <Image
                src="/Logo0.png"
                alt="RUD StepUp Logo"
                width={1000}
                height={1000}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="inline-flex items-center px-6 py-2 bg-slate-900 text-white text-xs font-bold tracking-widest rounded-full shadow-sm">
              ESTABLISHED 10 JULY 2026
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black tracking-tight">
              RUD StepUp Society of HMT
            </h1>
            <p className="text-slate-600 text-sm md:text-base font-medium max-w-2xl">
              Empowering students through skill development, leadership, innovation,
              collaboration, and meaningful experiences.
            </p>
          </header>
        </div>
      )}
    </div>
  );
}

