"use client";

import "./app.css";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = "force-dynamic";
import {
  Activity,
  Cpu,
  Globe,
  ArrowRight,
  Terminal,
  Loader2,
  Layers,
  Sparkles,
  Command,
  Zap
} from "lucide-react";
import { client, functions } from "@/lib/appwrite";
import Image from "next/image";
import NextjsLogo from "../static/nextjs-icon.svg";
import AppwriteLogo from "../static/appwrite-icon.svg";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
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

    // Realtime Subscription
    const unsubscribe = client.subscribe(
      [
        `databases.agentic_browser.collections.steps.documents`,
        `databases.agentic_browser.collections.logs.documents`
      ],
      (response) => {
        if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          const payload = response.payload;

          // Handle new Step
          if (payload.$collectionId === 'steps') {
            setSteps(prev => [...prev, payload]);
          }

          // Handle new Log
          if (payload.$collectionId === 'logs') {
            setLogs(prev => [...prev, {
              date: new Date(),
              message: payload.message,
              type: payload.type || 'info'
            }]);
          }
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  async function launchAgent() {
    if (!goal || status === "loading") return;
    setStatus("loading");
    setLogs([{ date: new Date(), message: "Initializing neural orchestrator...", type: "system" }]);

    try {
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
    <main className="checker-background min-h-screen flex flex-col items-center px-4 py-6 relative overflow-hidden text-sm md:text-base">

      {/* Dynamic Glow Orbs */}
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-6 mb-8 z-20"
      >
        <div className="glass-card rounded-xl p-2.5 float-animation">
          <Image src={NextjsLogo} alt="Next.js" width={24} height={24} className="invert opacity-90" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-purple-300 uppercase glow">Connected</span>
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </div>
        <div className="glass-card rounded-xl p-2.5 float-animation" style={{ animationDelay: '1.5s' }}>
          <Image src={AppwriteLogo} alt="Appwrite" width={24} height={24} className="opacity-90" />
        </div>
      </motion.div>

      {/* Main Layout */}
      <div className="w-full max-w-7xl z-10 flex flex-col h-[calc(100vh-140px)]">

        {/* Navigation Bar */}
        <div className="flex justify-center mb-6 shrink-0 z-50">
          <div className="glass-card p-1.5 rounded-full flex gap-1 shadow-2xl bg-black/40 backdrop-blur-2xl border border-white/5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <Command className="w-4 h-4" /> },
              { id: 'tools', label: 'Tools', icon: <Zap className="w-4 h-4" /> },
              { id: 'docs', label: 'Quickstart', icon: <Sparkles className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative glass-card rounded-3xl border border-white/5 shadow-2xl bg-black/20 backdrop-blur-3xl">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" ? (
              <DashboardView
                goal={goal}
                setGoal={setGoal}
                launchAgent={launchAgent}
                status={status}
                logs={logs}
                steps={steps}
                logsEndRef={logsEndRef}
              />
            ) : activeTab === "tools" ? (
              <ToolsView onLaunch={(prompt) => {
                setGoal(prompt);
                setActiveTab("dashboard");
                setTimeout(() => launchAgent(), 500);
              }} />
            ) : (
              <DocsView />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-4 z-20 text-xs text-gray-500 font-mono tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity">
        Designed by Umesh Patel
      </footer>
    </div>
    </main >
  );
}

// --- Sub-Components ---

function DashboardView({ goal, setGoal, launchAgent, status, logs, steps, logsEndRef }) {
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col p-6 md:p-8"
    >
      <header className="text-center mb-8">
        <h1 className="text-5xl font-extrabold tracking-tight mb-2">
          <span className="text-gradient-primary">AGENTIC</span>
          <span className="text-gradient-logo ml-3">BROWSER</span>
        </h1>
        <p className="text-gray-400 text-sm font-medium tracking-wide">
          GEN 2.0 AUTONOMOUS BROWSER • APPWRITE POWERED
        </p>
      </header>

      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col gap-6 min-h-0">

        {/* Input Bar */}
        <div className="glass-card rounded-2xl p-2 flex items-center shadow-lg group focus-within:ring-2 ring-purple-500/30 transition-all">
          <div className="px-4 text-purple-400 group-focus-within:text-purple-300 transition-colors">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <input
            type="text"
            placeholder="What is your mission objective?"
            className="flex-1 bg-transparent py-4 px-2 outline-none text-lg font-medium placeholder:text-gray-600 text-white"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <button
            onClick={launchAgent}
            disabled={status === "loading" || status === "running" || !goal}
            className="btn-primary text-white rounded-xl px-8 py-3 font-bold flex items-center gap-2 transition-all active:scale-95 m-1 disabled:opacity-50 disabled:grayscale"
          >
            {status === "running" ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            {status === "running" ? "ACTIVE" : "LAUNCH"}
          </button>
        </div>

        {/* Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">

          {/* Main Monitor (Steps) */}
          <div className="lg:col-span-8 glass-card rounded-2xl p-6 flex flex-col overflow-hidden bg-black/20">
            <div className="flex items-center justify-between mb-6 shrink-0 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Cpu className="text-purple-400 w-5 h-5" />
                <h2 className="text-lg font-bold text-gray-200">Neural Engine</h2>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono bg-purple-500/10 py-1 px-3 rounded-full border border-purple-500/20 uppercase tracking-widest text-purple-300">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Live Feed
              </div>
            </div>

            <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2 flex-1">
              <AnimatePresence mode="popLayout">
                {steps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-600 opacity-50">
                    <Activity className="w-12 h-12 mb-4 text-gray-700" />
                    <p className="text-sm font-medium tracking-wide">AWAITING MISSION PARAMETERS</p>
                  </div>
                ) : (
                  steps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="pl-6 border-l-2 border-purple-500/30 relative"
                    >
                      <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)]" />
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2 block">Step {i + 1}</span>
                      <p className="text-gray-100 font-light text-lg mb-3 leading-relaxed">{step.reasoning}</p>
                      <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-blue-200 border border-white/5 flex items-center gap-3">
                        <span className="text-purple-400 font-bold uppercase">{step.action}</span>
                        <span className="text-gray-500 truncate">{JSON.stringify(step.params)}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Side Monitor (Logs) */}
          <div className="lg:col-span-4 glass-card rounded-2xl flex flex-col overflow-hidden bg-black/40">
            <div className="bg-white/5 p-4 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">System Logs</span>
              </div>
            </div>
            <div className="p-4 font-mono text-[10px] overflow-y-auto flex-1 custom-scrollbar text-gray-400 leading-relaxed">
              <div className="space-y-2.5">
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-gray-600 shrink-0 select-none">[{log.date.toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}]</span>
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
  );
}

function ToolsView({ onLaunch }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const tools = [
    // 💰 Finance
    {
      category: "finance",
      name: "Crypto Tracker",
      description: "Real-time market values (INR/USD)",
      icon: <Activity className="w-5 h-5 text-green-400" />,
      action: "Go to https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,matic-network&vs_currencies=inr,usd and present the current prices in a styled table."
    },
    {
      category: "finance",
      name: "Forex Dashboard",
      description: "Global currency exchange rates",
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      action: "Go to https://api.frankfurter.app/latest?from=USD&to=INR,EUR,GBP,JPY and show the conversion rates to Indian Rupee."
    },
    // 🧠 Knowledge
    {
      category: "knowledge",
      name: "Tech Pulse",
      description: "Top stories from Hacker News",
      icon: <Terminal className="w-5 h-5 text-orange-400" />,
      action: "Go to https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty, fetch the first 5 stories, and summarize the key tech trends."
    },
    {
      category: "knowledge",
      name: "Wikipedia Pro",
      description: "India-focused Encyclopedia",
      icon: <Globe className="w-5 h-5 text-gray-200" />,
      action: "Go to https://en.wikipedia.org/api/rest_v1/page/summary/India and provide a concise summary."
    },
    // 🧪 Science
    {
      category: "science",
      name: "New Delhi Weather",
      description: "Live meteorological data",
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      action: "Go to https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.20&current_weather=true and report the current temperature and conditions."
    },
    {
      category: "science",
      name: "NASA Deep Space",
      description: "Astronomy Picture of the Day",
      icon: <Globe className="w-5 h-5 text-purple-500" />,
      action: "Go to https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY and describe the cosmic image."
    },
    // 🛠️ Utility
    {
      category: "utility",
      name: "IP Detective",
      description: "Network geolocation analysis",
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      action: "Go to https://ipapi.co/json/ and analyze my current network parameters."
    },
    {
      category: "utility",
      name: "Dictionary",
      description: "Etymology & definitions",
      icon: <Terminal className="w-5 h-5 text-teal-400" />,
      action: "Go to https://api.dictionaryapi.dev/api/v2/entries/en/namaste and explain the word."
    }
  ];

  const categories = ["all", "finance", "knowledge", "science", "utility"];
  const filteredTools = activeCategory === "all" ? tools : tools.filter(t => t.category === activeCategory);

  return (
    <motion.div
      key="tools"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full overflow-y-auto custom-scrollbar p-6 md:p-10"
    >
      <div className="max-w-6xl mx-auto pb-20">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Command Center</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Direct interface to global data streams. Select a module to initiate an autonomous agent task.
          </p>
        </header>

        {/* Filter Pills */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${activeCategory === cat
                ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105"
                : "bg-black/30 border-white/10 text-gray-500 hover:bg-white/10 hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool, i) => (
              <motion.div
                layout
                key={tool.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -5 }}
                className="glass-card rounded-2xl p-6 cursor-pointer group hover:bg-white/5 relative overflow-hidden flex flex-col h-full border-t border-white/5"
                onClick={() => onLaunch(tool.action)}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-5 h-5 text-white -rotate-45" />
                </div>

                <div className="mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{tool.description}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                  <div className="text-[10px] font-mono text-purple-300 bg-purple-500/10 p-2.5 rounded-lg border border-purple-500/20 truncate group-hover:bg-purple-500/20 transition-colors">
                    {tool.action}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function DocsView() {
  return (
    <motion.div
      key="docs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex gap-8 p-6"
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto py-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Quickstart Guide</h1>
            <p className="text-xl text-gray-400">Initialize your first autonomous mission in seconds.</p>
          </div>

          <div className="space-y-12">
            {[
              { step: 1, title: "Configure Environment", desc: "Ensure GEMINI_API_KEY is set in your .env.local file." },
              { step: 2, title: "Select a Tool", desc: "Navigate to the 'Tools' tab and select a pre-configured module." },
              { step: 3, title: "Observe Execution", desc: "Watch the Neural Engine plan and execute steps in real-time." }
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-xl">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
