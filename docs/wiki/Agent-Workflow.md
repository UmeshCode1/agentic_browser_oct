# Agent Workflow: The PAOD Loop

The "Brain" of the Agentic Browser follows a rigorous cycle to ensure goal achievement.

## 🔄 The Reasoning Cycle (Plan-Act-Observe-Decide)

### 1. Plan

The AI analyzes the defined **Goal** and the **Current State** of the browser. It breaks the goal into small, executable steps.

### 2. Act

The AI selects a specific browser action (e.g., `navigate`, `click`, `type`) and sends it to the **Executor Service**.

### 3. Observe

The Browser Service executes the action and returns an **Observation**:

- A new **Screenshot**.
- The updated **DOM Tree**.
- The current **URL**.

### 4. Decide (Reflect)

The AI compares the Observation with its initial Plan.

- **Success:** If the goal is achieved, it stops.
- **Failure:** If the action failed or the result was unexpected, it adjusts its reasoning.
- **Next Step:** If more steps are needed, it loops back to **Plan**.

---

## 🧠 Reasoning Example

**Goal:** "Find the stock price of Apple."

1. **Thought:** I need to go to a search engine.
2. **Action:** `navigate("https://google.com")`
3. **Observation:** Browser is at Google search page.
4. **Thought:** I will search for "Apple stock price".
5. **Action:** `type("input[name=q]", "Apple stock price")` -> `press("Enter")`
6. **Observation:** Search results show a card with the stock price.
7. **Thought:** I have the price. The goal is achieved.
8. **Final Decision:** Done. Result: "$234.56"
