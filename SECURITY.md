# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x (POC) | ✅ |

## Known Limitations (POC)

This is a proof-of-concept. The following are **known, intentional simplifications** not suitable for production:

- **CORS is fully open** (`allow_origins=["*"]`) — must be locked to specific origins before any real deployment
- **No authentication** — all API endpoints are publicly accessible
- **SQLite** — not suitable for concurrent production workloads; migrate to PostgreSQL
- **No HTTPS** — run behind a reverse proxy (nginx, Caddy) with TLS in production
- **Secrets** — no secrets are stored in this repo; environment variables must be used for any credentials

## Reporting a Vulnerability

Please **do not** open a public GitHub Issue for security vulnerabilities.

Report privately via [GitHub's private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability).

Please include a description, steps to reproduce, potential impact, and any suggested fix. Expect a response within 5 business days.
