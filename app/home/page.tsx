"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/AuthContext";

export default function HomePage() {
  const { authedAdmin, authedMemberId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authedAdmin && !authedMemberId) {
      router.replace("/");
    }
  }, [authedAdmin, authedMemberId, router]);

  if (!authedAdmin && !authedMemberId) {
    return null;
  }

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans relative overflow-x-hidden selection:bg-emerald-100">
      <div className="absolute top-[-5%] left-[-10%] w-[550px] h-[550px] bg-[#d1fae5]/40 rounded-full filter blur-[110px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[15%] right-[-10%] w-[600px] h-[600px] bg-[#fce7f3]/50 rounded-full filter blur-[100px] pointer-events-none mix-blend-multiply" />

      <header className="relative pt-2 pb-2 flex flex-col items-center justify-center px-6 text-center z-10 max-w-4xl mx-auto">
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

        <div className="inline-flex items-center px-6 py-2 bg-slate-900 text-white text-xs font-bold tracking-widest rounded-full mb-6 shadow-sm">
          ESTABLISHED 10 JULY 2026
        </div>

        <h1 className="text-4xl md:text-6xl font-serif text-[#0b1b3d] font-black tracking-tight mb-4 leading-[1.15]">
          RUD StepUp Society of HMT
        </h1>
        <p className="text-slate-600 text-sm md:text-base font-medium mb-8 max-w-2xl">
          Empowering students through skill development, leadership, innovation,
          collaboration, and meaningful experiences.
        </p>

        <div className="flex gap-3 justify-center items-center">
          <button
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-full hover:bg-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
            type="button"
            onClick={() => {}}
          >
            Apply Now <span>→</span>
          </button>

          <button
            className="px-5 py-2.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-900 hover:text-white transition-all"
            type="button"
            onClick={() => {}}
          >
            Explore Activities
          </button>
        </div>

        <div
          className="mt-20 flex justify-center cursor-pointer group z-50 relative transition-transform duration-300 hover:scale-110"
          onClick={() => {
            document
              .getElementById("metrics-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Image
            src="/Logo0.png"
            alt="Scroll down"
            width={200}
            height={200}
            className="w-32 h-32 object-contain opacity-50 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
      </header>

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

      <footer className="border-t border-slate-100 py-10 bg-slate-50/40">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-start gap-4 text-[11px] font-medium">
          <p className="text-left text-red-500">
            © 2026 RUD StepUp Society of HMT. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}



