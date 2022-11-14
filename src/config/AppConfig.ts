import { ClientOptions } from "discord.js";

export const AppConfig: ClientOptions = {
  intents: [
    "GUILDS",
    "GUILD_EMOJIS_AND_STICKERS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_VOICE_STATES",
    "MESSAGE_CONTENT"
  ],
  partials: [
    "CHANNEL",
    "GUILD_MEMBER",
    "MESSAGE",
    "REACTION",
    "USER"
  ]
}