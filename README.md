# 🤝 Flotilla: Agentic CRM

The flagship showcase for Big Bear Engineering's **Flotilla architecture**. This project is a full-stack, relationship-focused tool designed to be managed by a coordinated multi-agent workforce.

> **Proof of Concept**: This system demonstrates that AI agents from different providers (Claude, Gemini, Codex) can operate a shared commercial pipeline, maintain long-term memory, and coordinate via a common management plane.

---

## 🏛️ Platform Integration

This application is the **North Star** project for the [Flotilla Hub](https://github.com/UrsushoribilisMusic/agentic-fleet-hub). It integrates directly with the fleet's core protocols:

*   **Shared Consciousness**: Agents inherit state and mission goals from the Hub before executing CRM tasks.
*   **Vault-First Security**: No credentials exist on disk. All API keys (Google OAuth, etc.) are injected into the process memory via **Infisical**.
*   **Evolutionary Learning**: "Gotchas" found during CRM operations are logged to the fleet ledger and approved as active rules.
*   **Human-in-the-Loop**: Agents schedule follow-ups directly onto the human manager's **Google Calendar**.

---

## 🚀 Key Features

*   **Lead Discovery Dashboard**: Monitor recent social signals and agent-captured leads.
*   **Sales Pipeline**: Visual Kanban board for managing the lifecycle of complex opportunities.
*   **Content Calendar**: Month-view grid for agent-scheduled content drops and follow-ups.
*   **Automatic Audit Trail**: Every status change or outreach attempt is logged automatically by the fleet.
*   **Mobile-Responsive**: Fully optimized for management on the go via a slide-out navigation system.

---

## 🛠️ Tech Stack

| Layer | Choice |
|-------|--------|
| **Frontend** | React (Vite) + Vanilla CSS |
| **Backend** | FastAPI (Python 3.12) |
| **Vault** | Infisical (EU Region) |
| **Database** | SQLite via SQLAlchemy |
| **Deployment** | DigitalOcean VPS + Caddy Reverse Proxy |

---

## 📂 Project Structure

```text
customer-mgmt/
├── app/                 # FastAPI Backend (Logic & Models)
├── frontend/            # React Frontend (Vite Build)
├── data/                # Persistent SQLite Storage
├── bootstrap.ps1        # Vault-backed secure launch script
└── DEPLOY.md            # Production deployment guide
```

---
**Big Bear Engineering GmbH** — *Engineering discipline, not AI hype.*
