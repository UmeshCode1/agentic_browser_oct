"use client";

import "./app.css";
import "@appwrite.io/pink-icons";
import { useState, useEffect, useRef, useCallback } from "react";
import { client } from "@/lib/appwrite";
import { AppwriteException } from "appwrite";
import NextjsLogo from "../static/nextjs-icon.svg";
import AppwriteLogo from "../static/appwrite-icon.svg";
import Image from "next/image";

export default function Home() {
  const [detailHeight, setDetailHeight] = useState(55);
  const [status, setStatus] = useState("idle");
  const [goal, setGoal] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [steps, setSteps] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const detailsRef = useRef(null);

  const updateHeight = useCallback(() => {
    if (detailsRef.current) {
      setDetailHeight(detailsRef.current.clientHeight);
    }
  }, [logs, showLogs]);

  useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [updateHeight]);

  useEffect(() => {
    if (!detailsRef.current) return;
    detailsRef.current.addEventListener("toggle", updateHeight);

    return () => {
      if (!detailsRef.current) return;
      detailsRef.current.removeEventListener("toggle", updateHeight);
    };
  }, []);

  async function launchAgent() {
    if (!goal || status === "loading") return;
    setStatus("loading");
    setLogs([{ date: new Date(), message: "Initializing agent...", type: "system" }]);

    try {
      // Logic would call start-agent function
      const result = { success: true, taskId: "mock-task-id" }; // Mock for demo
      setTaskId(result.taskId);
      setStatus("running");

      // Simulate steps
      setTimeout(() => {
        setSteps([{
          reasoning: "I need to search for the goal on Google.",
          action: "navigate",
          params: { url: "https://google.com" }
        }]);
        setLogs(prev => [...prev, { date: new Date(), message: "Navigating to Google...", type: "action" }]);
      }, 2000);

    } catch (err) {
      setStatus("error");
      setLogs(prev => [...prev, { date: new Date(), message: "Failed to start agent.", type: "error" }]);
    }
  }

  return (
    <main
      className="checker-background flex flex-col items-center p-5"
      style={{ marginBottom: `${detailHeight}px` }}
    >
      <div className="mt-25 flex w-full max-w-[40em] items-center justify-center lg:mt-34">
        <div className="rounded-[25%] border border-[#19191C0A] bg-[#F9F9FA] p-3 shadow-[0px_9.36px_9.36px_0px_hsla(0,0%,0%,0.04)]">
          <div className="rounded-[25%] border border-[#FAFAFB] bg-white p-5 shadow-[0px_2px_12px_0px_hsla(0,0%,0%,0.03)] lg:p-9">
            <Image
              alt={"Next.js logo"}
              src={NextjsLogo}
              width={56}
              height={56}
            />
          </div>
        </div>
        <div
          className={`flex w-38 items-center transition-opacity duration-2500 ${status === "success" ? "opacity-100" : "opacity-0"}`}
        >
          <div className="to-[rgba(253, 54, 110, 0.15)] h-[1px] flex-1 bg-gradient-to-l from-[#f02e65]"></div>
          <div className="icon-check flex h-5 w-5 items-center justify-center rounded-full border border-[#FD366E52] bg-[#FD366E14] text-[#FD366E]"></div>
          <div className="to-[rgba(253, 54, 110, 0.15)] h-[1px] flex-1 bg-gradient-to-r from-[#f02e65]"></div>
        </div>
        <div className="rounded-[25%] border border-[#19191C0A] bg-[#F9F9FA] p-3 shadow-[0px_9.36px_9.36px_0px_hsla(0,0%,0%,0.04)]">
          <div className="rounded-[25%] border border-[#FAFAFB] bg-white p-5 shadow-[0px_2px_12px_0px_hsla(0,0%,0%,0.03)] lg:p-9">
            <Image
              alt={"Appwrite logo"}
              src={AppwriteLogo}
              width={56}
              height={56}
            />
          </div>
        </div>
      </div>

      <section className="mt-12 flex w-full max-w-[40em] flex-col items-center">
        <h1 className="mb-6 font-[Poppins] text-3xl font-bold text-[#2D2D31]">
          Agentic Browser
        </h1>

        <div className="flex w-full gap-2 mb-8">
          <input
            type="text"
            placeholder="What should the agent do? (e.g. Find weather in Bhopal)"
            className="flex-1 rounded-md border border-[#EDEDF0] bg-white px-4 py-3 outline-none focus:border-[#FD366E]"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <button
            onClick={launchAgent}
            disabled={status === "loading" || status === "running"}
            className="rounded-md bg-[#FD366E] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "running" ? "Running..." : "Launch Agent"}
          </button>
        </div>

        {status === "running" && (
          <div className="w-full rounded-md border border-[#FD366E52] bg-[#FD366E0A] p-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 animate-ping rounded-full bg-[#FD366E]"></div>
              <span className="text-sm font-medium text-[#FD366E]">Agent Reasoning...</span>
            </div>
          </div>
        )}
      </section>

      <div className="grid w-full max-w-[60em] gap-7 lg:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-md border border-[#EDEDF0] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#2D2D31]">Reasoning & Steps</h2>
          <div className="flex flex-col gap-4">
            {steps.length === 0 ? (
              <p className="text-[#97979B]">No steps executed yet.</p>
            ) : (
              steps.map((step, i) => (
                <div key={i} className="border-l-2 border-[#FD366E] pl-4">
                  <p className="text-sm font-semibold uppercase text-[#FD366E]">Step {i + 1}</p>
                  <p className="mt-1 text-[#2D2D31]">{step.reasoning}</p>
                  <code className="mt-2 block rounded bg-[#FAFAFB] p-2 text-xs">
                    {step.action}({JSON.stringify(step.params)})
                  </code>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border border-[#EDEDF0] bg-white p-6">
          <h2 className="text-xl font-semibold text-[#2D2D31]">Live Logs</h2>
          <div className="flex max-h-[300px] flex-col gap-2 overflow-y-auto font-[Fira_Code] text-xs">
            {logs.length === 0 ? (
              <p className="text-[#97979B]">Waiting for agent connection...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[#97979B] shrink-0">[{log.date.toLocaleTimeString()}]</span>
                  <span className={log.type === "error" ? "text-red-500" : log.type === "action" ? "text-blue-500" : "text-[#2D2D31]"}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-rows-3 gap-7 lg:grid-cols-3 lg:grid-rows-none">
        <div className="flex h-full w-72 flex-col gap-2 rounded-md border border-[#EDEDF0] bg-white p-4">
          <h2 className="text-xl font-light text-[#2D2D31]">Edit your app</h2>
          <p>
            Edit{" "}
            <code className="rounded-sm bg-[#EDEDF0] p-1">app/page.js</code> to
            get started with building your app.
          </p>
        </div>
        <a
          href="https://cloud.appwrite.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex h-full w-72 flex-col gap-2 rounded-md border border-[#EDEDF0] bg-white p-4">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-light text-[#2D2D31]">
                Go to console
              </h2>
              <span className="icon-arrow-right text-[#D8D8DB]"></span>
            </div>
            <p>
              Navigate to the console to control and oversee the Appwrite
              services.
            </p>
          </div>
        </a>

        <a
          href="https://appwrite.io/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex h-full w-72 flex-col gap-2 rounded-md border border-[#EDEDF0] bg-white p-4">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-light text-[#2D2D31]">
                Explore docs
              </h2>
              <span className="icon-arrow-right text-[#D8D8DB]"></span>
            </div>
            <p>
              Discover the full power of Appwrite by diving into our
              documentation.
            </p>
          </div>
        </a>
      </div>

      <aside className="fixed bottom-0 flex w-full cursor-pointer border-t border-[#EDEDF0] bg-white">
        <details open={showLogs} ref={detailsRef} className={"w-full"}>
          <summary className="flex w-full flex-row justify-between p-4 marker:content-none">
            <div className="flex gap-2">
              <span className="font-semibold">Logs</span>
              {logs.length > 0 && (
                <div className="flex items-center rounded-md bg-[#E6E6E6] px-2">
                  <span className="font-semibold">{logs.length}</span>
                </div>
              )}
            </div>
            <div className="icon">
              <span className="icon-cheveron-down" aria-hidden="true"></span>
            </div>
          </summary>
          <div className="flex w-full flex-col lg:flex-row">
            <div className="flex flex-col border-r border-[#EDEDF0]">
              <div className="border-y border-[#EDEDF0] bg-[#FAFAFB] px-4 py-2 text-[#97979B]">
                Project
              </div>
              <div className="grid grid-cols-2 gap-4 p-4">
                <div className="flex flex-col">
                  <span className="text-[#97979B]">Endpoint</span>
                  <span className="truncate">
                    https://fra.cloud.appwrite.io/v1
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#97979B]">Project-ID</span>
                  <span className="truncate">
                    6945d1c2000111091fd1
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[#97979B]">Project name</span>
                  <span className="truncate">
                    web broweser
                  </span>
                </div>
              </div>
            </div>
            <div className="flex-grow">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-[#EDEDF0] bg-[#FAFAFB] text-[#97979B]">
                    {logs.length > 0 ? (
                      <>
                        <td className="w-52 py-2 pl-4">Date</td>
                        <td>Status</td>
                        <td>Method</td>
                        <td className="hidden lg:table-cell">Path</td>
                        <td className="hidden lg:table-cell">Response</td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 pl-4">Logs</td>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <tr key={`log-${index}-${log.date.getTime()}`}>
                        <td className="py-2 pl-4 font-[Fira_Code]">
                          {log.date.toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td>
                          {log.status > 400 ? (
                            <div className="w-fit rounded-sm bg-[#FF453A3D] px-1 text-[#B31212]">
                              {log.status}
                            </div>
                          ) : (
                            <div className="w-fit rounded-sm bg-[#10B9813D] px-1 text-[#0A714F]">
                              {log.status}
                            </div>
                          )}
                        </td>
                        <td>{log.method}</td>
                        <td className="hidden lg:table-cell">{log.path}</td>
                        <td className="hidden font-[Fira_Code] lg:table-cell">
                          {log.response}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key="no-logs">
                      <td className="py-2 pl-4 font-[Fira_Code]">
                        There are no logs to show
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </details>
      </aside>
    </main>
  );
}
