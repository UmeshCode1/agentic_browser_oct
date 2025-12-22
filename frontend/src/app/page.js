"use client";

import "./app.css";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = "force-dynamic";
import {
  Globe,
  ArrowRight,
  Loader2,
  Sparkles,
  Command,
  CheckCircle2,
  BrainCircuit,
  Terminal,
  ChevronRight
} from "lucide-react";
import { client, functions } from "@/lib/appwrite";

export default function Home() {
  const [goal, setGoal] = useState("");
  const [status, setStatus] = useState("idle"); // idle, thinking, active, done
  const [conversation, setConversation] = useState([]); // Array of { type: 'user' | 'agent' | 'system', content: ... }
  const [steps, setSteps] = useState([]);
  const logsEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, steps]);

  const [currentTaskId, setCurrentTaskId] = useState(null);

  // Appwrite Init
  useEffect(() => {
    const init = async () => {
      try {
        await client.ping();
      } catch (error) {
        console.error("Appwrite Init Failed", error);
      }
    };
    init();

    // Subscribe to Steps
    const unsubscribe = client.subscribe(
      `databases.agentic_browser.collections.steps.documents`,
      (response) => {
        if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          const payload = response.payload;
          // Only show steps for the current task
          if (currentTaskId && payload.taskId === currentTaskId) {
            setSteps(prev => [...prev, payload]);
          } else if (!currentTaskId) {
            // Fallback if state isn't updated yet (rare race) or legacy
            // Ideally we strictly filter, but for demo we can be loose or strict.
            // Let's be semi-strict: if we have a task ID, enforce it.
            if (payload.taskId) setSteps(prev => [...prev, payload]);
          }
        }
      }
    );

    return () => unsubscribe();
  }, [currentTaskId]);

  async function launchAgent() {
    if (!goal || status === "thinking") return;

    // Add User Message
    setConversation(prev => [...prev, { type: 'user', content: goal }]);
    setStatus("thinking");
    setSteps([]); // Clear previous steps

    // Generate Task ID
    const taskId = 'task_' + Math.random().toString(36).substr(2, 9);
    setCurrentTaskId(taskId); // Update state for subscription filter

    const currentGoal = goal;
    setGoal(""); // Clear input

    try {
      const execution = await functions.createExecution(
        'agent-orchestrator', // UPDATED ID
        JSON.stringify({ goal: currentGoal, taskId: taskId }) // Correct Payload
      );

      const response = JSON.parse(execution.responseBody);

      if (response.success) {
        setStatus("active");
      } else {
        throw new Error(response.error || "Failed to start");
      }
    } catch (err) {
      console.error("Agent Launch Error:", err);
      setStatus("error");
      setConversation(prev => [...prev, { type: 'system', content: "Connection severed. Neural link failed. (Backend Error)" }]);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-hidden text-sm md:text-base selection:bg-purple-500/30">

      {/* Hero Header */}
      <header className="w-full max-w-4xl mx-auto pt-20 pb-12 text-center z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-gradient-fellou">
            Agentic Browser
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto">
            Intent to Action Plan. <span className="text-purple-400">Autonomous.</span>
          </p>
        </motion.div>
      </header>

      {/* Main Interface */}
      <div className="w-full max-w-3xl flex-1 flex flex-col z-10 px-4 pb-24">

        {/* Conversation Feed */}
        <div className="flex-1 space-y-8 mb-8 min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {conversation.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'user' ? (
                  <div className="bubble-user px-6 py-4 text-white max-w-[80%] shadow-lg">
                    {msg.content}
                  </div>
                ) : (
                  <div className="text-red-400 font-mono text-xs bg-red-900/20 px-4 py-2 rounded">
                    {msg.content}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Agent Active State (The Brain) */}
            {(status === "active" || steps.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                <div className="bubble-agent">
                  <div className="flex items-center gap-3 mb-4 text-purple-400">
                    <BrainCircuit className={`w-5 h-5 ${status === 'active' ? 'animate-pulse' : ''}`} />
                    <span className="font-bold tracking-widest text-xs uppercase">Neural Engine</span>
                  </div>

                  {/* Steps Stream */}
                  <div className="space-y-4">
                    {steps.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group relative"
                      >
                        <div className="absolute left-[-25px] top-2 w-2 h-2 rounded-full bg-purple-600 ring-4 ring-purple-600/10 group-hover:ring-purple-600/30 transition-all" />
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-colors">
                          <h4 className="text-gray-200 font-medium mb-1">{step.reasoning}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 font-mono mt-2">
                            <Terminal className="w-3 h-3" />
                            <span className="uppercase text-purple-400">{step.action}</span>
                            <span className="truncate opacity-50 max-w-[200px]">{JSON.stringify(step.params)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Loading Indicator */}
                    {status === 'active' && (
                      <div className="flex items-center gap-3 text-gray-500 pl-4">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                        <span className="text-xs tracking-widest uppercase">Processing...</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={logsEndRef} />
        </div>

        {/* Floating Input Bar */}
        <div className="fixed bottom-12 left-0 right-0 px-4 z-50">
          <div className="max-w-xl mx-auto fellou-input p-2 flex items-center shadow-2xl relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[99px] opacity-20 blur group-focus-within:opacity-40 transition-opacity pointer-events-none" />

            <div className="pl-4 pr-2 text-purple-400">
              {status === 'idle' ? <Sparkles className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
            </div>

            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-white px-3 py-3 placeholder:text-gray-600"
              placeholder="Ask the agent to browse..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && launchAgent()}
              disabled={status !== 'idle'}
            />

            <button
              onClick={launchAgent}
              disabled={!goal || status !== 'idle'}
              className="fellou-button p-3 rounded-full hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center mt-6">
            <span className="text-[10px] text-gray-600 font-mono tracking-[0.3em] uppercase opacity-50 hover:opacity-100 transition-opacity cursor-default">
              Designed by Umesh Patel
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}
