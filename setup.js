#!/usr/bin/env node

/**
 * Demo setup for AI Agent Marketplace
 * Installs frontend and backend dependencies via npm workspaces (contracts excluded)
 */

import { execSync } from 'child_process';
import { existsSync, copyFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORKSPACE_INSTALL =
  'npm install --workspaces --include-workspace-root --ignore-scripts';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
  try {
    execSync(command, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });
    return true;
  } catch (error) {
    return false;
  }
}

function checkNodeVersion() {
  try {
    const version = execSync('node --version', { encoding: 'utf-8' }).trim();
    const majorVersion = parseInt(version.replace('v', '').split('.')[0], 10);
    if (majorVersion < 18) {
      log(`⚠️  Warning: Node.js ${version} detected. Node.js 18+ is recommended.`, 'yellow');
      return false;
    }
    log(`✓ Node.js ${version} detected`, 'green');
    return true;
  } catch (error) {
    log('✗ Node.js not found. Please install Node.js 18+ first.', 'red');
    return false;
  }
}

function dependenciesInstalled(rootDir, frontendDir, backendDir) {
  return (
    existsSync(join(rootDir, 'node_modules')) &&
    existsSync(join(frontendDir, 'node_modules')) &&
    existsSync(join(backendDir, 'node_modules'))
  );
}

function installDependencies(rootDir) {
  const lockPath = join(rootDir, 'package-lock.json');
  if (existsSync(lockPath)) {
    log('   Using package-lock.json (npm ci)...', 'blue');
    if (runCommand('npm ci --workspaces --include-workspace-root --ignore-scripts', rootDir)) {
      return true;
    }
    log('   npm ci failed — falling back to npm install...', 'yellow');
  }
  return runCommand(WORKSPACE_INSTALL, rootDir);
}

/**
 * Create .env file locally: copy from .env.example if present, otherwise write default content.
 */
function createEnvFile(dir, envExamplePath, envPath, defaultContent) {
  const fullEnvPath = join(dir, envPath);
  const fullExamplePath = join(dir, envExamplePath);

  if (existsSync(fullEnvPath)) {
    return;
  }

  if (existsSync(fullExamplePath)) {
    try {
      copyFileSync(fullExamplePath, fullEnvPath);
      return;
    } catch (error) {
      // fall through to default write
    }
  }

  try {
    writeFileSync(fullEnvPath, defaultContent, 'utf-8');
  } catch (error) {
    // non-fatal for demo
  }
}

function ensureEnvFiles(frontendDir, backendDir) {
  log('\n📝 Creating environment files...', 'blue');
  createEnvFile(frontendDir, '.env.example', '.env', '');
  createEnvFile(backendDir, '.env.example', '.env', '');
}

async function main() {
  log('\n🚀 Setting up AI Agent Marketplace (demo)...\n', 'blue');

  if (!checkNodeVersion()) {
    process.exit(1);
  }

  const rootDir = __dirname;
  const frontendDir = join(rootDir, 'frontend');
  const backendDir = join(rootDir, 'backend');

  if (!existsSync(frontendDir) || !existsSync(backendDir)) {
    log('✗ Project structure is incomplete. Please ensure frontend/ and backend/ exist.', 'red');
    process.exit(1);
  }

  ensureEnvFiles(frontendDir, backendDir);

  if (dependenciesInstalled(rootDir, frontendDir, backendDir)) {
    log('\n✓ Dependencies already installed — skipping npm install', 'green');
    log('\n✅ Setup complete!\n', 'green');
    log('Next steps:', 'blue');
    log('1. Start both servers: npm run dev', 'blue');
    log('2. Or start separately:', 'blue');
    log('   - Backend:  npm run dev:backend', 'blue');
    log('   - Frontend: npm run dev:frontend', 'blue');
    log('3. Database/tests: npm run setup:full (optional)\n', 'blue');
    return;
  }

  log('\n📦 Installing dependencies (frontend + backend only)...', 'blue');
  if (!installDependencies(rootDir)) {
    log('✗ Failed to install dependencies', 'red');
    process.exit(1);
  }
  log('✓ Dependencies installed', 'green');

  log('\n✅ Setup complete!\n', 'green');
  log('Next steps:', 'blue');
  log('1. Start both servers: npm run dev', 'blue');
  log('2. Or start separately:', 'blue');
  log('   - Backend:  npm run dev:backend', 'blue');
  log('   - Frontend: npm run dev:frontend', 'blue');
  log('3. Database/tests: npm run setup:full (optional)\n', 'blue');
}

main().catch((error) => {
  log(`\n✗ Setup failed: ${error.message}`, 'red');
  process.exit(1);
});
