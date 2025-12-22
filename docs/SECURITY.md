# Security Policy

The **Agentic Browser** is designed with a "Zero-Trust, Zero-Leak" philosophy. This document outlines how we secure user data, API keys, and execution environments.

## 🔐 Architecture Security

### 1. The "Air-Gapped" Client

The Frontend (Client) contains **zero** secrets. It does not know your Gemini Key, your Executor Key, or your Database Secret.

- **Vulnerability**: If the frontend is compromised, no keys are leaked.
- **Communication**: All sensitive requests are proxied through Appwrite Functions.

### 2. The Relay (Backend)

The `agent-orchestrator` function acts as a firewall.

- **Verification**: It validates the Appwrite Session before forwarding any request.
- **Isolation**: It runs in a secure, ephemeral runtime that is destroyed after execution.

### 3. The Vault (Executor)

The Executor (Railway) is the only service that holds the "Keys to the Kingdom" (Gemini API Key).

- **Protection**: Access is restricted by a strong `EXECUTOR_API_KEY`.
- **Environment**: Keys are injected at runtime via encrypted Environment Variables. They are never committed to code.

## 🛡️ Data Privacy

- **No Persistence**: The Agentic Browser does not store your browsing history permanently.
- **Ephemeral Session**: Each "Mission" spins up a fresh browser context. When the mission ends, the context is nuked (cookies, cache, local storage deleted).
- **Logs**: We store execution logs in Appwrite for your review. You have full ownership and can delete these logs at any time.

## 🚨 Reporting Vulnerabilities

If you discover a security vulnerability, please report it immediately to **<security@aimlclub.tech>**.
**DO NOT** create a public GitHub issue for security exploits.

## 🤖 Bot Protection

The Executor uses standard "Headless Browser" signatures. While we implement some stealth techniques, users should be aware that aggressive automation may trigger anti-bot protections on target websites. Use responsibly.
