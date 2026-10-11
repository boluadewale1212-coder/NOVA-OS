'use strict';

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, isJidGroup } = require('@whiskeysockets/baileys');
const pino = require('pino');
const config = require('../config/config');
const MessageHandler = require('./handlers/messages');
const { viewOnceHandler } = require('./features/viewOnceCapture');
const { autoForwardHandler } = require('./features/autoForward');

class Bot {
  constructor() {
    this.sock = null;
    this.logger = pino({ level: config.logLevel });
    this.messageHandler = null;
    this.isReady = false;
    this.pairingCodeRequested = false;
  }

  async initialize() {
    try {
      const { state, saveCreds } = await useMultiFileAuthState(config.sessionPath);

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: this.logger,
        browser: ['NOVA OS', 'Safari', '1.0.0'],
        syncFullHistory: false,
        markOnlineOnConnect: true,
      });

      this.messageHandler = new MessageHandler(this);
      this.sock.ev.on('creds.update', saveCreds);
      this.setupEventListeners(state);
    } catch (error) {
      console.error('❌ Error initializing bot:', error);
      throw error;
    }
  }

  async requestPairingCode(state) {
    if (!this.sock || this.pairingCodeRequested || state?.creds?.registered) return;

    this.pairingCodeRequested = true;

    const rawPhone = (config.ownerNumber || '2348069675806').replace(/\D/g, '');
    if (!rawPhone) {
      console.log('⚠️  OWNER_NUMBER is empty. Cannot request pairing code.');
      return;
    }

    try {
      const pairingCode = await this.sock.requestPairingCode(rawPhone);
      console.log('================================');
      console.log('Pairing code for WhatsApp:');
      console.log(pairingCode);
      console.log('Open WhatsApp → Linked Devices → Link a device → Enter this code');
      console.log('================================');
    } catch (error) {
      console.error('❌ Failed to generate pairing code:', error.message);
    }
  }

  setupEventListeners(state) {
    this.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'connecting') {
        console.log('📡 Connecting to WhatsApp...');
      } else if (connection === 'open') {
        this.isReady = true;

        if (!state?.creds?.registered) {
          await this.requestPairingCode(state);
        }

        console.log('✅ Bot connected successfully!');
        console.log(`🤖 Bot: ${config.botName}`);
        console.log(`👤 Owner: ${config.ownerName} (${config.ownerNumber})`);
        console.log('\n💬 Ready to receive messages...\n');
      } else if (connection === 'close') {
        this.isReady = false;
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          console.log('⚠️  Connection closed. Reconnecting...');
          setTimeout(() => this.initialize(), 3000);
        } else {
          console.log('❌ Connection closed. Logged out.');
        }
      }
    });

    this.sock.ev.on('messages.upsert', async (m) => {
      const messages = m.messages || [];

      for (const msg of messages) {
        if (!msg.message) continue;

        try {
          if (config.enableViewOnceCapture) {
            await viewOnceHandler(msg, this);
          }

          if (config.enableAutoForward) {
            await autoForwardHandler(msg, this);
          }

          await this.messageHandler.handle(msg);
        } catch (error) {
          console.error('❌ Error handling message:', error);
        }
      }
    });
  }

  async sendMessage(jid, text, options = {}) {
    try {
      return await this.sock.sendMessage(jid, {
        text,
        ...options,
      });
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  }

  async sendMedia(jid, buffer, type = 'image', caption = '') {
    try {
      const mediaKey = type === 'image' ? 'image' : 'video';
      return await this.sock.sendMessage(jid, {
        [mediaKey]: buffer,
        caption,
      });
    } catch (error) {
      console.error('❌ Error sending media:', error);
    }
  }

  async disconnect() {
    try {
      if (this.sock) {
        await this.sock.logout();
        this.isReady = false;
      }
    } catch (error) {
      console.error('❌ Error disconnecting:', error);
    }
  }

  isOwner(jid) {
    return jid === `${config.ownerNumber}@s.whatsapp.net` || jid === config.ownerNumber;
  }

  isGroup(jid) {
    return isJidGroup(jid);
  }
}

module.exports = Bot;
