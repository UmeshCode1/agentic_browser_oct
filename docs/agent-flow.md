# Agent Workflow: Plan-Act-Observe-Decide

The Agentic Browser follows a cyclic reasoning process to achieve its goals.

## The Loop

### 1. Plan

The agent receives the user's goal and the current page state (DOM summary, URL). It identifies the high-level strategy and the immediate next step.

### 2. Act

The agent translates its plan into a concrete browser action.
Actions include:

- `navigate(url)`
- `click(selector)`
- `type(selector, text)`
- `scroll(direction)`
- `scrape(details)`

### 3. Observe

After the action is executed by the Playwright service, the agent receives:

- A screenshot of the new page state.
- A simplified DOM tree / Accessibility tree.
- The current URL.
- Any network errors or console logs.

### 4. Decide (Reasoning)

The agent analyzes the observation.

- **Is the goal achieved?** If yes, summarize the result and stop.
- **Did the last action fail?** If yes, reason why and adjust the plan.
- **Is more information needed?** If yes, plan the next exploratory action.

## Reasoning Strategy

We use **Chain-of-Thought (CoT)** prompting. The agent is forced to "speak its thoughts" into a log before deciding on an action. This mimics human browsing behavior:

1. "I am on the search results page."
2. "I need to find the link for 'Weather in Bhopal'."
3. "I see a link that says 'Bhopal Weather - AccuWeather'."
4. "I will click that link."

## Error Handling

- **Retries:** If a selector is not found, the agent retries with a different strategy or scrolls.
- **Self-Correction:** If the agent ends up on a 404 page, it navigates back or re-searches.
- **Timeout:** Maximum steps are enforced to prevent infinite loops.
