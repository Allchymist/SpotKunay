import { Client, ClientEvents, VoiceState } from "discord.js";

export default class InteractionCreate {
  type: keyof ClientEvents;

  constructor() {
    this.type = 'voiceStateUpdate';
  }

  async execute(client: Client<true>, oldState: VoiceState, newState: VoiceState) {
    if (oldState.member.user.bot || newState.member.user.bot) return;
    if (oldState.channelId == newState.channelId) return;

    const player = client.manager.get(oldState.guild.id);
    if (!player) return;
  
    if (!oldState.channelId) { // Usuário entrou na call
      if (player.playing) return;

      if (player.queue.totalSize > 0) {
        return player.pause(false);
      }
    } else { // Usuário saiu na call
      const membersInChannel = oldState.channel.members.filter((member) => !member.user.bot);
      
      if (membersInChannel.size < 1) {
        if (player.playing) return player.pause(true);

        setTimeout(() => {
          if (player.playing) return;
          return player.destroy();
        }, 60000);
      }
    }
  }
}