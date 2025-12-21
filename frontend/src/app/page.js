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
import { client, functions } from "@/lib/appwrite";
import Image from "next/image";
import NextjsLogo from "../static/nextjs-icon.svg";
import AppwriteLogo from "../static/appwrite-icon.svg";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | docs
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

  useEffect(() => {
    const init = async () => {
      try {
        await client.ping();
        console.log("Appwrite Ping Success");
        setLogs(prev => [...prev, { date: new Date(), message: "System Online: Secure connection verified.", type: "success" }]);
      } catch (error) {
        console.error("Appwrite Ping Failed", error);
        setLogs(prev => [...prev, { date: new Date(), message: "Connection Error: Failed to reach command server.", type: "error" }]);
      }
    };
    init();
  }, []);

  async function launchAgent() {
    if (!goal || status === "loading") return;
    setStatus("loading");
    setLogs([{ date: new Date(), message: "Initializing neural orchestrator...", type: "system" }]);

    try {
      // 1. Trigger the Start Agent function
      const execution = await functions.createExecution(
        'start-agent',
        JSON.stringify({ goal, userId: 'user_frontend_demo' })
      );

      const response = JSON.parse(execution.responseBody);

      if (response.success) {
        setTaskId(response.taskId);
        setStatus("running");
        setLogs(prev => [...prev, { date: new Date(), message: `Mission Control: Task ${response.taskId} initiated.`, type: "success" }]);
        setLogs(prev => [...prev, { date: new Date(), message: "Orchestrator: Analysis running on cloud...", type: "system" }]);
      } else {
        throw new Error(response.error || "Failed to start agent");
      }
    } catch (err) {
      setStatus("error");
      setLogs(prev => [...prev, { date: new Date(), message: "Failed to initialize mission.", type: "error" }]);
    }
  }

  return (
    <main className="checker-background min-h-screen flex flex-col items-center px-4 py-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#3b82f6]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8b5cf6]/10 blur-[120px] rounded-full" />

      {/* Header / Logos */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-6 mb-8 z-20"
      >
        <div className="glass-card rounded-2xl p-3 float-animation">
          <Image src={NextjsLogo} alt="Next.js" width={32} height={32} className="invert" />
        </div>
        <div className="flex flex-col items-center">
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-2" />
          <Activity className="text-blue-500 w-4 h-4 animate-pulse" />
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-2" />
        </div>
        <div className="glass-card rounded-2xl p-3 float-animation" style={{ animationDelay: '1s' }}>
          <Image src={AppwriteLogo} alt="Appwrite" width={32} height={32} />
        </div>
      </motion.div>

      {/* Main Content Container */}
      <div className="w-full max-w-6xl z-10 flex flex-col h-[85vh]">

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass-card p-1 rounded-full flex gap-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "dashboard" ? "bg-white/10 text-white shadow-lg" : "text-gray-400 hover:text-white"
                }`}
            >
              Agent Dashboard
            </button>
            <button
              onClick={() => setActiveTab("tools")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "tools" ? "bg-white/10 text-white shadow-lg" : "text-gray-400 hover:text-white"
                }`}
            >
              Tools & Integrations
            </button>
            <button
              onClick={() => setActiveTab("docs")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "docs" ? "bg-white/10 text-white shadow-lg" : "text-gray-400 hover:text-white"
                }`}
            >
              Quickstart Guide
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col"
              >
                <header className="text-center mb-8">
                  <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent mb-2">
                    AGENTIC BROWSER
                  </h1>
                  <p className="text-gray-400 text-sm font-medium">Autonomous Intelligence • Appwrite Orchestration • Gemini 2.0</p>
                </header>

                <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                  {/* Input Section */}
                  <motion.div layout className="glass-card rounded-2xl p-2 mb-6 flex items-center shadow-2xl">
                    <div className="px-4 text-gray-400">
                      <Globe className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Define the mission goal..."
                      className="flex-1 bg-transparent py-4 px-2 outline-none text-lg font-medium placeholder:text-gray-600"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                    />
                    <button
                      onClick={launchAgent}
                      disabled={status === "loading" || status === "running" || !goal}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-8 py-3 font-bold flex items-center gap-2 transition-all active:scale-95 m-1"
                    >
                      {status === "running" ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                      {status === "running" ? "ACTIVE" : "LAUNCH"}
                    </button>
                  </motion.div>

                  {/* Dashboard Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                    {/* Reasoning Panel */}
                    <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col overflow-hidden">
                      <div className="flex items-center justify-between mb-6 shrink-0">
                        <div className="flex items-center gap-3">
                          <Cpu className="text-purple-400 w-5 h-5" />
                          <h2 className="text-lg font-bold">Reasoning Engine</h2>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono bg-white/5 py-1 px-3 rounded-full border border-white/10 uppercase tracking-widest text-blue-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          Live Sync
                        </div>
                      </div>
                      <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">
                        <AnimatePresence mode="popLayout">
                          {steps.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center text-gray-600">
                              <Layers className="w-8 h-8 mb-3 opacity-20" />
                              <p className="text-sm">Agent is awaiting instructions.</p>
                            </div>
                          ) : (
                            steps.map((step, i) => (
                              <motion.div
                                key={i}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="pl-6 border-l border-blue-500/30 relative"
                              >
                                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1 block">Step {i + 1}</span>
                                <p className="text-white font-light mb-2">{step.reasoning}</p>
                                <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-blue-200 border border-white/5">
                                  <span className="text-purple-400">{step.action}</span>
                                  <span className="text-gray-500 ml-2">{JSON.stringify(step.params)}</span>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Logs Panel */}
                    <div className="glass-card rounded-2xl flex flex-col overflow-hidden bg-black/40">
                      <div className="bg-white/5 p-4 border-b border-white/5 shrink-0">
                        <div className="flex items-center gap-2">
                          <Terminal className="w-4 h-4 text-gray-400" />
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Logs</span>
                        </div>
                      </div>
                      <div className="p-4 font-mono text-[10px] overflow-y-auto flex-1 custom-scrollbar">
                        <div className="space-y-2">
                          {logs.map((log, i) => (
                            <div key={i} className="flex gap-2">
                              <span className="text-gray-600 shrink-0">[{log.date.toLocaleTimeString([], { hour12: false })}]</span>
                              <span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-gray-300'}>
                                {log.message}
                              </span>
                            </div>
                          ))}
                          <div ref={logsEndRef} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : activeTab === "tools" ? (
              <ToolsView onLaunch={(prompt) => {
                setGoal(prompt);
                setActiveTab("dashboard");
                // Small delay to allow tab switch to render before launching
                setTimeout(() => launchAgent(), 500);
              }} />
            ) : (
              <DocsView />
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function DocsView() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex gap-8"
    >
      {/* Sidebar */}
      <div className="w-64 glass-card rounded-2xl p-6 hidden md:block h-full overflow-y-auto">
        <h3 className="font-bold text-white mb-6 tracking-wide">DOCUMENTATION</h3>
        <ul className="space-y-4 text-sm font-medium text-gray-400">
          <li className="text-blue-400">Quickstart</li>
          <li className="hover:text-white cursor-pointer transition-colors">Architecture</li>
          <li className="hover:text-white cursor-pointer transition-colors">Configuration</li>
          <li className="hover:text-white cursor-pointer transition-colors">API Reference</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 glass-card rounded-2xl p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-white mb-2">Quickstart</h1>
          <p className="text-gray-400 mb-8 text-lg">Your first autonomous mission in 30 seconds.</p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs text-center border border-blue-500/50">1</span>
              Configure Environment
            </h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Ensure you have your environment variables set locally or in your deployment.
            </p>
            <div className="bg-black/50 border border-white/10 rounded-xl p-4 font-mono text-sm text-gray-300 overflow-x-auto">
              <div className="flex select-none text-gray-600 mb-2 border-b border-white/10 pb-2">.env.local</div>
              <p><span className="text-purple-400">GEMINI_API_KEY</span>=AIzaTx...</p>
              <p><span className="text-purple-400">EXECUTOR_API_KEY</span>=sk_exec_...</p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs text-center border border-blue-500/50">2</span>
              Launch a Mission
            </h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Navigate to the <b className="text-white">Dashboard</b> tab and enter a natural language command.
            </p>
            <div className="bg-blue-500/10 border-l-2 border-blue-500 p-4 rounded-r-xl mb-4">
              <p className="text-blue-200 italic">"Go to google.com, search for 'DeepMind', and summarize the first result."</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs text-center border border-blue-500/50">3</span>
              Watch it Think
            </h2>
            <p className="text-gray-400 leading-relaxed">
              The Agentic Browser uses a <b>Plan-Act-Observe-Decide</b> loop. You will see real-time logs in the console panel as the agent navigates the web autonomously.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
