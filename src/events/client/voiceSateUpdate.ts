import { Client, VoiceState, User, TextChannel } from "discord.js";

const Timeout = new Set();

export default class VoiceStateUpdate {
  type: string;

  constructor() {
    this.type = 'voiceStateUpdate';
  }

  async run(client: Client<true>, oldState: VoiceState, newState: VoiceState) {

    if (oldState.member.user.bot) return;
    if (oldState.channelId === newState.channelId) return;

    const player = client.Music.get(oldState.guild.id);

    if (player) {
      const target = player.queue.current.requester as User;

      if (!oldState.channelId) { // new user joined
        if (newState.member.id === target.id) {
          if (player.voiceChannel !== newState.channelId) return;
          if (Timeout.has(target.id)) {
            player.pause(false);
            Timeout.delete(target.id);
          }
        }

      } else { // user left
        if (oldState.channel.members.filter(m => !m.user.bot).size < 1) {
          if (player.voiceChannel !== oldState.channelId) return;
          if (player.playing) {
            player.pause(true);

            if (!Timeout.has(target.id)) {
              Timeout.add(target.id);
              setTimeout(() => {
                if (player.playing) return;
                Timeout.delete(target.id);
                player.destroy();

                const channel = client.channels.cache.get(player.textChannel) as TextChannel;
                channel?.send(`${client.emote('n')} Fim da fila, adiquira o **Premium** para usar o bot 24/7.`);

              }, 1000 * 60);
            }
          }
        }
      }
    }
  }
}