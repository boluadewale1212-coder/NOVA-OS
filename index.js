#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
require('dotenv').config();

const Bot = require('./src/bot');
const config = require('./config/config');

function printBanner() {
  console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║         🚀 NOVA OS v1.0.0                 ║
║       Powered by BIGACE                    ║
║      WhatsApp Bot using Baileys            ║
║                                            ║
╚════════════════════════════════════════════╝
`);
}

function validateConfig() {
  const requiredKeys = ['SESSION_ID', 'OWNER_NUMBER', 'BOT_NAME'];
  const missing = requiredKeys.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\n📝 Copy .env.example to .env and fill in the required values\n');
    process.exit(1);
  }
}

function ensureSessionDir() {
  const sessionDir = path.join(__dirname, 'session');
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
  }
}

function setupGracefulShutdown(bot) {
  const signals = ['SIGINT', 'SIGTERM'];

  signals.forEach((signal) => {
    process.on(signal, async () => {
      console.log(`\n\n⚠️  ${signal} received - shutting down gracefully...`);
      try {
        await bot.disconnect();
        console.log('✅ Bot disconnected successfully');
      } catch (error) {
        console.error('❌ Error during shutdown:', error.message);
      }
      process.exit(0);
    });
  });
}

process.on('uncaughtException', (error) => {
  console.error('\n❌ Uncaught Exception:');
  console.error(error);
  console.error('\n🔄 Restarting in 5 seconds...\n');
  setTimeout(() => process.exit(1), 5000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n❌ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});

async function main() {
  try {
    printBanner();
    validateConfig();
    ensureSessionDir();

    console.log('📋 Configuration:');
    console.log(`   Bot Name: ${config.botName}`);
    console.log(`   Owner: ${config.ownerName}`);
    console.log(`   Prefix: ${config.prefix}`);
    console.log(`   Mode: ${config.mode}`);
    console.log(`   ViewOnce Capture: ${config.enableViewOnceCapture ? '✅' : '❌'}`);
    console.log();

    const bot = new Bot();
    setupGracefulShutdown(bot);

    console.log('🔌 Initializing bot...');
    await bot.initialize();
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

main();
