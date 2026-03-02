# Simple CRM Deployment Guide (Local Network)

This guide will help you run the CRM and allow others on your local network (like Martin) to access it.

## 1. Setup the Backend
Open a terminal in the root folder and run:
```powershell
.venv\Scripts\python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*Note: `--host 0.0.0.0` is required for network access.*

## 2. Setup the Frontend
Open a **second** terminal in `frontend/` and run:
```powershell
npm run dev
```
Vite is configured to listen on `0.0.0.0:5173`.

## 3. Network Access
To let Martin access the CRM from his PC:
1.  Find your Local IP address (Run `ipconfig` in CMD, look for `IPv4 Address`, e.g., `192.168.1.50`).
2.  Tell Martin to open his browser to: **http://YOUR_IP:5173** (e.g., `http://192.168.1.50:5173`).

---

### "Not Secure" Warning Fix
If the browser shows a "Not Secure" warning:
-   This is because we are using **HTTP** (standard for local dev) instead of HTTPS.
-   Martin can safely click **"Advanced"** and then **"Proceed to ..."**.
-   Ensure he is NOT typing `https://` in the address bar. It must be `http://`.
