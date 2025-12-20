"use client";

import "./app.css";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = "force-dynamic";
import {
  Search,
  Terminal,
  Activity,
  Cpu,
  Globe,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers
} from "lucide-react";
import { client } from "@/lib/appwrite";
import Image from "next/image";
import NextjsLogo from "../static/nextjs-icon.svg";
import AppwriteLogo from "../static/appwrite-icon.svg";

export default function Home() {
  const [status, setStatus] = useState("idle");
  const [goal, setGoal] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [steps, setSteps] = useState([]);
  const logsEndRef = useRef(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  async function launchAgent() {
    if (!goal || status === "loading") return;
    setStatus("loading");
    setLogs([{ date: new Date(), message: "Initializing neural orchestrator...", type: "system" }]);

    try {
      // Logic would call start-agent function
      setTimeout(() => {
        const result = { success: true, taskId: "task_" + Math.random().toString(36).substr(2, 9) };
        setTaskId(result.taskId);
        setStatus("running");

        setLogs(prev => [...prev, { date: new Date(), message: "Connection established with Playwright cluster.", type: "success" }]);

        // Simulate progress for the "World Best" demo
        setTimeout(() => {
          setSteps([{
            reasoning: "Goal analyzed. Initiating target site navigation to gather context.",
            action: "navigate",
            params: { url: "https://google.com" }
          }]);
          setLogs(prev => [...prev, { date: new Date(), message: "Navigating to entry point...", type: "action" }]);
        }, 1500);

      }, 1000);

    } catch (err) {
      setStatus("error");
      setLogs(prev => [...prev, { date: new Date(), message: "Failed to initialize mission.", type: "error" }]);
    }
  }

  return (
    <main className="checker-background min-h-screen flex flex-col items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FD366E]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      {/* Header / Logos */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-6 mb-16"
      >
        <div className="glass-card rounded-2xl p-4 float-animation">
          <Image src={NextjsLogo} alt="Next.js" width={40} height={40} className="invert" />
        </div>
        <div className="flex flex-col items-center">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#FD366E] to-transparent mb-2" />
          <Activity className="text-[#FD366E] w-5 h-5 animate-pulse" />
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#FD366E] to-transparent mt-2" />
        </div>
        <div className="glass-card rounded-2xl p-4 float-animation" style={{ animationDelay: '1s' }}>
          <Image src={AppwriteLogo} alt="Appwrite" width={40} height={40} />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="w-full max-w-5xl z-10">
        <header className="text-center mb-12">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-extrabold tracking-tighter bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent mb-4"
          >
            AGENTIC BROWSER
          </motion.h1>
          <p className="text-gray-400 font-medium">Autonomous Intelligence • Appwrite Orchestration • Gemini 2.0</p>
        </header>

        {/* Input Section */}
        <motion.div
          layout
          className="glass-card rounded-3xl p-2 mb-12 flex items-center shadow-2xl overflow-hidden focus-within:border-[#FD366E]/50 transition-colors"
        >
          <div className="px-6 text-gray-400">
            <Globe className="w-6 h-6" />
          </div>
          <input
            type="text"
            placeholder="Define the mission goal..."
            className="flex-1 bg-transparent py-6 px-2 outline-none text-xl font-medium placeholder:text-gray-600"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <button
            onClick={launchAgent}
            disabled={status === "loading" || status === "running" || !goal}
            className="bg-[#FD366E] hover:bg-[#e02a5d] disabled:opacity-50 text-white rounded-2xl px-10 py-5 font-bold flex items-center gap-2 transition-all active:scale-95 m-1"
          >
            {status === "running" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
            {status === "running" ? "ACTIVE" : "LAUNCH"}
          </button>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Reasoning Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-3xl p-8 h-full min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Cpu className="text-blue-400 w-6 h-6" />
                  <h2 className="text-2xl font-bold">Reasoning Engine</h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono bg-white/5 py-1 px-3 rounded-full border border-white/10 uppercase tracking-widest text-blue-300">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  Live Sync
                </div>
              </div>

              <div className="space-y-6 flex-grow">
                <AnimatePresence mode="popLayout">
                  {steps.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center text-gray-500 py-20"
                    >
                      <Layers className="w-12 h-12 mb-4 opacity-20" />
                      <p>Agent is awaiting instructions.</p>
                      <p className="text-sm">Initiate mission to see reasoning loop.</p>
                    </motion.div>
                  ) : (
                    steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative pl-8 border-l border-[#FD366E]/30"
                      >
                        <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-[#FD366E] pink-glow" />
                        <span className="text-xs font-bold text-[#FD366E] uppercase tracking-wider mb-2 block">Step {i + 1}</span>
                        <p className="text-lg text-white leading-relaxed font-light">{step.reasoning}</p>
                        <div className="mt-4 glass-card border-none bg-white/5 rounded-xl p-4 font-mono text-sm text-blue-300">
                          <code className="flex items-center gap-2">
                            <span className="text-pink-400">{step.action}</span>
                            <span className="text-gray-500">(</span>
                            {JSON.stringify(step.params)}
                            <span className="text-gray-500">)</span>
                          </code>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Real-time Logs Panel */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl border-[#FD366E]/20 overflow-hidden flex flex-col h-full bg-black/40">
              <div className="bg-white/5 p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#FD366E]" />
                  <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">System Logs</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-[#FD366E] animate-pulse" />
              </div>
              <div className="p-4 font-mono text-[11px] overflow-y-auto max-h-[600px] flex-grow custom-scrollbar">
                <div className="space-y-3">
                  {logs.length === 0 && (
                    <div className="text-gray-600 italic">Waiting for connection...</div>
                  )}
                  {logs.map((log, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i}
                      className="flex gap-3 leading-tight"
                    >
                      <span className="text-gray-700 shrink-0">[{log.date.toLocaleTimeString([], { hour12: false })}]</span>
                      <span className={`
                        ${log.type === "error" ? "text-red-400" :
                          log.type === "action" ? "text-blue-400" :
                            log.type === "success" ? "text-emerald-400" :
                              "text-gray-400"}
                      `}>
                        {log.message}
                      </span>
                    </motion.div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer info/links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center text-gray-600 text-xs font-mono uppercase tracking-[0.3em]"
        >
          Secure Session • End-to-End Encryption • Distributed Core
        </motion.div>
      </div>
    </main>
  );
}
