'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../../config/config');

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.commands = new Map();
    this.loadCommands();
  }

  loadCommands() {
    const commandsDir = config.commandsPath;

    const walkDir = (dir) => {
      const files = fs.readdirSync(dir);

      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else if (file.endsWith('.js')) {
          try {
            const cmd = require(filePath);
            if (cmd.name) {
              this.commands.set(cmd.name, cmd);
              console.log(`✅ Loaded command: ${cmd.name}`);
            }
          } catch (error) {
            console.error(`❌ Error loading command ${file}:`, error.message);
          }
        }
      });
    };

    if (fs.existsSync(commandsDir)) {
      walkDir(commandsDir);
    }
  }

  async handle(msg, msgBody, sender, isGroup, isOwner) {
    try {
      const args = msgBody.slice(config.prefix.length).trim().split(/\s+/);
      const cmdName = args[0]?.toLowerCase();

      if (!cmdName) return;

      const cmd = this.commands.get(cmdName);
      if (!cmd) return;

      if (cmd.owner_only && !isOwner) {
        await this.bot.sendMessage(sender, '❌ This command is only for the bot owner.');
        return;
      }

      if (cmd.group_only && !isGroup) {
        await this.bot.sendMessage(sender, '❌ This command only works in groups.');
        return;
      }

      const botRef = this.bot;
      const msgWrapper = {
        text: msgBody,
        args: args.slice(1),
        from: sender,
        isGroup,
        isOwner,
        raw: msg,

        async reply(text) {
          return await botRef.sendMessage(sender, text);
        },

        async sendMedia(buffer, type, caption) {
          return await botRef.sendMedia(sender, buffer, type, caption);
        }
      };

      console.log(`\n🎯 Executing command: ${cmdName}`);
      await cmd.execute(msgWrapper, cmd, botRef);
    } catch (error) {
      console.error('❌ Error handling command:', error);
      await this.bot.sendMessage(sender, '❌ An error occurred while executing the command.');
    }
  }
}

module.exports = CommandHandler;
