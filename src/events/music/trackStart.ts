import { Client, TextChannel } from "discord.js";
import { Player, Track } from "erela.js";
import moment from 'moment';
import 'moment-duration-format';

export default class trackStart {
  type: string;
  
  constructor() {
    this.type = 'trackStart'; 
  }

  run(client: Client<true>, player: Player, track: Track) {
    const channel = client.channels.cache.get(player.textChannel) as TextChannel;
    const time = player.queue.reduce((a, b) => a + b.duration, 0);

    channel?.send({
      embeds: [{
        author: {name: track.title.length >= 50 ? track.title.substring(0, 50).padEnd(53, ".") : track.title, icon_url: client.emote("note").url, url: track.uri },
        footer: { text: client.user.username, icon_url: channel.guild.iconURL() },
        color: "GREEN", thumbnail: { url: track?.thumbnail || "" },
        description: `**${client.emote("voice")} Tocando em: ${client.channels.cache.get(player.voiceChannel)}**\n` +
        `**${client.emote("hey")} Pedido por: ${track.requester}**\n` +
        `**📀 Canal: \`${track.author}\`**\n` + `**📄 Músicas na fila: \`${player.queue.size > 1 ? `${player.queue.size} Músicas` : "Sem músicas na fila"}\`**\n` +
        `**🕑 Duração da música: \`${moment.duration(track.duration, "milliseconds").format("hh:mm:ss")}\`**\n` +
        `${player.queue.size > 1 ? `**🕑 Duração da playlist: \`${moment.duration(time, "milliseconds").format("hh:mm:ss")}\`**` : ""}`
      }]
    });
  }
 }