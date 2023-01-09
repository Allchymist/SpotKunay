import { ApplicationCommandData, Client, ChatInputCommandInteraction } from "discord.js";

import moment from "moment";
import 'moment-duration-format';

export default class Music {
  data: ApplicationCommandData;
  cooldown: number;

  constructor() {
    this.data = {
      name: 'music',
      description: 'Informação da música e fila de reprodução'
    }

    this.cooldown = 10;
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const player = client.manager.get(interaction.guildId);
    if (!player) return interaction.editReply('Não há músicas tocando');

    const songs = player.queue,
          song = songs.current,
          time = moment.duration(player.position, "milliseconds").format("ss"),
          Time = moment.duration(player.position, "milliseconds").format("ss"),
          maxTime = moment.duration(song.duration, "milliseconds").format("ss"),
          timeFormat = moment.duration(Time, "seconds").format("hh:mm:ss"),
          maxTimeFormat = moment.duration(maxTime, "seconds").format("hh:mm:ss");

    if (!songs[0]) return interaction.editReply({
      embeds: [{
        color: 0x0099ff, thumbnail: { url: song.thumbnail },
        author: { name: song.title.length > 50 ? song.title.substring(0, 50).padEnd(53, ".") : song.title, url: song.uri },
        description: `**[${progressBar(Time, maxTime, 10)}](${song.uri + '&t=' + time + 's'}) ㅤ${timeFormat} / ${maxTimeFormat}\n` +
        `Canal: \`${song.author}\`\nVolume: \`${player.volume}%\`\n` +
        `Pausada: \`${player.paused ? "Sim" : "Não"}\`\n` +
        `Loop: \`${player.trackRepeat ? "Música repetindo" : player.queueRepeat ? "Fila repetindo" : "Desativado"}\`\n` +
        `Canal de voz: ${interaction.guild.channels.cache.get(player.voiceChannel)}**`
      }]
    });

    const timeReduce = songs.reduce((a, b) => a + b.duration, 0);
    const timeTotal = moment.duration(timeReduce, "milliseconds").format("hh:mm:ss");
  
    return interaction.editReply({
      embeds: [{
        color: 0x0099FF,
        author: { name: song.title.length > 50 ? song.title.substring(0, 50).padEnd(53, ".") : song.title, url: song.uri },
        footer: { text: "Selecione uma música do menu!", icon_url: client.user.displayAvatarURL() },
        description: `**[${progressBar(Time, maxTime, 10)}](${song.uri + '&t=' + timeReduce + 's'}) ㅤ${timeFormat} / ${maxTimeFormat}\n` +
        `Canal: \`${song.author}\`\nVolume: \`${player.volume}%\`\n` +
        `Pausada: \`${player.paused ? "Sim" : "Não"}\`\nLoop: \`${player.trackRepeat ? "Música repetindo" : player.queueRepeat ? "Fila repetindo" : "Desativado"}\`\n` +
        `Músicas na fila: \`${songs.size > 1 ? `${songs.size} Músicas` : "1 Música"}\`\nDuração da playlist: \`${timeTotal}\`\n` +
        `Canal de voz: ${interaction.guild.channels.cache.get(player.voiceChannel)}**`
      }]
    });
  }
}

function progressBar(value, maxValue, size) {
  const percentage = value / maxValue;
  const progress = Math.round(size * percentage);
  const emptyProgress = size - progress;

  const progressText = "─".repeat(progress);
  const emptyProgressText = "─".repeat(emptyProgress);

  const bar = progressText + "◯" + emptyProgressText;
  return bar;
}
