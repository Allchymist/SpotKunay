import { ClientOptions, Partials } from "discord.js";

export const AppConfig: ClientOptions = {
  intents: [
    "GuildEmojisAndStickers",
    "GuildMembers",
    "GuildMessageReactions",
    "GuildMessages",
    "Guilds",
    "MessageContent",
    "GuildVoiceStates"
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User
  ]
}