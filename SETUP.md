# Setup Guide

Simple setup instructions to get the AI Agent Marketplace running.

---

## Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm 9+** (comes with Node.js)
- **MetaMask** browser extension (optional, for wallet features)

**No database required!** The backend uses mock data by default.  
**No .env file setup needed!** The setup script automatically creates `.env` files with sensible defaults.

---

## Quick Setup (3 Steps)

### 1. Install Dependencies

Run the setup script from the project root:

```bash
npm run setup
```

This installs dependencies for **frontend and backend only** (demo mode) and creates `.env` files automatically. It uses `npm ci` when `package-lock.json` is present for faster, reproducible installs. If dependencies are already installed, setup skips the download step.

**Optional — database and tests (not needed for the demo):**
```bash
npm run setup:full
```

**Or install manually:**
```bash
npm ci --workspaces --include-workspace-root
```

### 2. Start the Application

**Option A: Start both servers with one command (recommended)**
```bash
npm run dev
```
This starts both frontend and backend in a single terminal with colored output.

**Option B: Start servers separately**

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

### 3. Access the Application

- **Frontend:** http://localhost:5173 (or the port shown in terminal)
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

**That's it!** The application should be running.

---

## Understanding the Project Structure

This project uses **npm workspaces** for the demo app (frontend + backend):

```
ai-agent-marketplace/
├── package.json          # Root workspace config
├── package-lock.json     # Locked dependency versions (faster installs)
├── frontend/
│   └── package.json      # Frontend dependencies (React, Vite, etc.)
├── backend/
│   └── package.json      # Backend dependencies (Express, etc.)
└── contracts/            # Smart contract source (not installed by demo setup)
```

**Demo setup installs:**
- Root tools (`concurrently`)
- Frontend and backend packages

**Not installed by `npm run setup`:**
- `contracts/` (Hardhat) — run `npm run setup:contracts` when you need to compile or deploy
- Prisma, PostgreSQL client, Jest — use `npm run setup:full` when you need a real database or tests

**Install all demo workspaces at once:**
```bash
npm ci --workspaces --include-workspace-root
```

---

## Troubleshooting

### "Command not found" errors
- Make sure you're in the project root directory
- Ensure Node.js is installed: `node --version`

### Port already in use
- Backend uses port 3001, frontend uses 5173 (or next available)
- Change ports in `backend/.env` (PORT) or `frontend/vite.config.js`

### Dependencies won't install
- Delete `node_modules` folders (root, frontend, backend) and run `npm run setup` again
- Clear npm cache: `npm cache clean --force`
- Make sure you have Node.js 18+

### Frontend won't start
- Check that all dependencies are installed: `npm run setup`
- Verify Node.js version: `node --version` (should be 18+)

### Backend won't start
- Run `npm run setup` from the project root
- Verify the port isn't in use
- Check console for error messages

---

## What's Next?

1. Setup complete — start with `npm run dev`
2. Open http://localhost:5173 in your browser
3. Check the health endpoint: http://localhost:3001/health
4. Explore the codebase!

---

## Advanced Setup

For database configuration, contract deployment, and production settings, see **[docs/SETUP.md](docs/SETUP.md)**. Smart contract tooling: `npm run setup:contracts`.

---

**That's it! No database, no complex configuration needed. Just install and run!**
