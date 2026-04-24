# Infrastructure & Tool Integration Log

## Google Workspace Integration Issue (2026-04-24)

### Symptom
- Project summary sheet creation failed due to missing `google-workspace` MCP server.
- The agent (Antigravity) remembered past project details via Wiki/Obsidian but lost execution capability for Google Workspace tools.

### Root Cause
- **Session Volatility**: MCP servers like Google Workspace require per-session activation or periodic OAuth re-authentication.
- **Memory Gap**: The long-term memory (Wiki/Obsidian) successfully tracks code and business state but does NOT track the "Tool Environment State".

### Mitigation & Future Rule
1. **Infrastructure Pre-check**: At the start of every session involving documentation or reporting, the agent MUST verify the presence of `google-workspace` tools.
2. **User Notification**: If a required tool is missing from the current MCP context, the agent must inform the user immediately and request re-activation instead of attempting fallback methods without explanation.
3. **State Persistence**: Investigate methods to store encrypted tokens or session IDs in a more persistent local storage within the Hermes environment.

## GitHub-First Workflow & Exodus Migration (2026-04-24)

### Status Update
- **Migration**: Successfully moved `data/` to `dashboard/data/` to ensure Netlify Functions can access the insights data.
- **Path Fixing**: Updated `dashboard/src/app/api/insights/route.ts` and `src/utils/storage.ts` to use consistent relative paths within the GitHub repository structure.
- **Deployment**: Pushed changes directly to GitHub (`e30a47a3`) to trigger Netlify's automatic build.

### New Principle: GitHub-First
- **Principle**: The GitHub repository (`johnkim3016/ShortSqueeze-AI`) is now the **Source of Truth**.
- **Action**: All code changes and data migrations must be performed via **GitHub MCP** or verified against the remote repository to avoid OneDrive sync conflicts.
- **Workspace**: The agent (A공명) will prioritize GitHub-based tools and paths over local OneDrive absolute paths.

### Status Update (V3 Stability)
- **Problem**: Encountered a runtime crash (`Cannot find package '\var\task\dashboard'`) likely caused by Windows path mangling in the Next.js/Netlify runtime or version mismatch.
- **Solution**: 
  - Downgraded Next.js to stable `15.1.0`.
  - Simplified `netlify.toml` by removing the explicit `@netlify/plugin-nextjs` (allowing Netlify's native Next.js support to handle it).
  - Renamed package to `shortsqueeze-dashboard` to avoid name collisions.
- **Verification**: Waiting for the build of commit `792c412c`.

---
*Updated by A공명 (Zhuge Liang of AI) under the direction of Kim Sabu.*
