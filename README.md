# Decentralized AI Agent Marketplace

**Proof of Concept (PoC)** — A blockchain-based marketplace for publishing, monetizing, and trading autonomous AI agents. No coding needed to run it; pick your system below and follow the 3 steps.

---

## What you'll see

When it's running, open your browser to **http://localhost:5173** and you'll see the app home page:

![App home page](docs/screenshot_1.png)

---

## Mac

**Step 1 — Open a terminal.** Open **Terminal** (search "Terminal" in Spotlight).

![Mac — open Terminal](docs/mac_open_terminal.png)

**Step 2 — Copy, paste, and run ONE command.** Paste this, then press Enter:

```bash
curl -s https://bitbucket.org/daam602/ai-agent-marketplace/raw/main/scripts/install.sh | bash
```

![Mac — paste command and run](docs/mac_terminal_opend.png)

The first run may take a few minutes. When you see a message that the app is running, go to Step 3.

**Step 3 — Open the app in your browser.** Go to **http://localhost:5173**. You should see the AI Agent Marketplace home page (as in the first screenshot above).

---

## Windows

**Step 1 — Open a terminal.** Press `Win + R`, type `cmd`, press Enter.

![Windows — open CMD](docs/windows_open_cmd.png)

**Step 2 — Copy, paste, and run ONE command.** Paste this, then press Enter:

```cmd
curl -sL https://bitbucket.org/daam602/ai-agent-marketplace/raw/main/scripts/install-windows.bat -o %TEMP%\install-aim.bat && %TEMP%\install-aim.bat
```

![Windows — paste command and run](docs/windows_terminal_opened.png)

The first run may take a few minutes. When you see a message that the app is running, go to Step 3.

**Step 3 — Open the app in your browser.** Go to **http://localhost:5173**. You should see the AI Agent Marketplace home page (as in the first screenshot above).

---

## Linux

**Step 1 — Open a terminal.** Open your **Terminal** app.

**Step 2 — Copy, paste, and run ONE command.** Paste this, then press Enter:

```bash
curl -s https://bitbucket.org/daam602/ai-agent-marketplace/raw/main/scripts/install.sh | bash
```

The first run may take a few minutes. When you see a message that the app is running, go to Step 3.

**Step 3 — Open the app in your browser.** Go to **http://localhost:5173**. You should see the AI Agent Marketplace home page (as in the first screenshot above).

---

## How to stop it

- Click in the terminal window where the app is running, then press **Ctrl + C** (Windows/Linux) or **Cmd + C** (Mac).
- Or just close that terminal window.

---

*Technical details: [SETUP.md](SETUP.md)*
