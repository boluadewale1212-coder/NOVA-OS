'use strict';

const config = require('../../config/config');

async function viewOnceHandler(msg, bot) {
  try {
    const viewOnce = msg.message?.viewOnceMessage?.message;
    if (!viewOnce) return;

    const sender = msg.key.remoteJid;
    const senderName = msg.pushName || 'Unknown';
    const isGroup = sender?.includes('@g.us') || false;

    const viewOnceType = Object.keys(viewOnce)[0];
    if (!viewOnceType) return;

    console.log(`\n📸 ViewOnce media detected from ${senderName}`);

    let buffer = null;
    try {
      buffer = await bot.sock.downloadMediaMessage(msg, 'buffer', {});
    } catch (error) {
      console.log('⚠️  ViewOnce media download failed, sending fallback alert');
    }

    const ownerJid = `${config.ownerNumber}@s.whatsapp.net`;
    const caption = `📸 ViewOnce ${viewOnceType === 'imageMessage' ? 'Photo' : 'Video'}\nFrom: ${senderName}\nChat: ${isGroup ? sender : 'Direct Message'}\nTime: ${new Date().toLocaleString()}`;

    if (buffer) {
      await bot.sendMedia(ownerJid, buffer, viewOnceType === 'imageMessage' ? 'image' : 'video', caption);
    } else {
      await bot.sendMessage(ownerJid, caption);
    }
  } catch (error) {
    // Ignore non-viewOnce messages
  }
}

module.exports = { viewOnceHandler };
