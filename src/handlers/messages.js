'use strict';

const config = require('../../config/config');
const CommandHandler = require('./commands');

class MessageHandler {
  constructor(bot) {
    this.bot = bot;
    this.commandHandler = new CommandHandler(bot);
  }

  async handle(msg) {
    try {
      const msgBody = msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        '';

      if (!msgBody || msgBody.trim() === '') return;

      const sender = msg.key.remoteJid;
      const isGroup = sender?.includes('@g.us') || false;
      const isOwner = this.bot.isOwner(sender);

      const senderName = msg.pushName || 'Unknown';
      console.log(`\n📨 Message from ${senderName} ${isGroup ? '(Group)' : '(DM)'}:`);
      console.log(`   ${msgBody.substring(0, 60)}${msgBody.length > 60 ? '...' : ''}`);

      if (msgBody.startsWith(config.prefix)) {
        await this.commandHandler.handle(msg, msgBody, sender, isGroup, isOwner);
      }
    } catch (error) {
      console.error('❌ Error in message handler:', error);
    }
  }
}

module.exports = MessageHandler;
