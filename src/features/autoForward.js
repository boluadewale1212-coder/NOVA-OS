'use strict';

const config = require('../../config/config');

async function autoForwardHandler(msg, bot) {
  try {
    const sender = msg.key.remoteJid;
    const isGroup = sender?.includes('@g.us') || false;

    if (!isGroup && sender !== `${config.ownerNumber}@s.whatsapp.net`) {
      const msgBody = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';

      if (msgBody && !msg.key.fromMe) {
        const senderName = msg.pushName || 'Unknown';
        const ownerJid = `${config.ownerNumber}@s.whatsapp.net`;
        const text = `📨 DM from ${senderName}\n\n${msgBody}\n\n_Timestamp: ${new Date().toLocaleString()}_`;

        await bot.sendMessage(ownerJid, text);
        console.log(`✅ DM from ${senderName} forwarded to owner`);
      }
    }
  } catch (error) {
    // Ignore DM forwarding errors silently
  }
}

module.exports = { autoForwardHandler };
