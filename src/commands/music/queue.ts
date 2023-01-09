import {
  ApplicationCommandData,
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  Client,
} from "discord.js";

import moment from "moment";
import 'moment-duration-format';

export default class Play {
  data: ApplicationCommandData;
  cooldown: number;
  inVoiceChannel?: boolean;

  constructor() {
    this.data = {
      name: 'queue',
      description: 'Fila de músicas',
      options: [{
        name: 'title',
        description: 'Titulo da música que está na fila',
        type: ApplicationCommandOptionType.String,
        required: true,
        autocomplete: true
      }, {
        name: 'option',
        description: 'O que deseja fazer com o essa música ?',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          { name: 'Pular para essa música', value: 'skip' },
          { name: 'Remover música da fila', value: 'remove' },
          { name: 'Tocar na próxima', value: 'next' }
        ]
      }]
    }

    this.inVoiceChannel = true;
    this.cooldown = 5;
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    const title = interaction.options.getString('title');
    const option = interaction.options.getString('option');

    const player = client.manager.get(interaction.guildId);
    if (!player) return interaction.editReply('Não há músicas tocando');

    if (option == 'skip') {
      const findTrack = player.queue.find(({ uri }) => uri === title);
      if (!findTrack) return interaction.editReply("Esta música não está na fila");

      await player.play(findTrack);

      return interaction.editReply("Tocando música selecionada\n*Ao final da música a fila continuará normalmente.*");
    }

    if (option == 'next') {
      const findTrack = player.queue.find(({ uri }) => uri == title);
      if (!findTrack) return interaction.editReply("Esta música não está na fila");

      const pos = player.queue.indexOf(findTrack)
      player.queue.splice(pos, 1);

      player.queue.unshift(findTrack);

      return interaction.editReply("Será tocada na próxima e foi removida da fila.");
    }

    if (option == 'remove') {
      const findTrack = player.queue.find(({ uri }) => uri == title);
      if (!findTrack) return interaction.editReply("Esta música não está na fila");

      const pos = player.queue.indexOf(findTrack)
      player.queue.splice(pos, 1);

      return interaction.editReply("Música removida da fila");
    }
  }

  async autoComplete(client: Client, interaction: AutocompleteInteraction) {
    const focusedValue = interaction.options.getFocused();

    const player = client.manager.get(interaction.guildId);
    if (!player) return await interaction.respond([{ name: 'Não há músicas tocando', value: '1' }]);
    if (player.queue.size < 1) return await interaction.respond([{ name: 'Não há músicas na fila', value: '1' }]);

    const tracks = player.queue.slice(0, 25)
    .filter(({ title }) => title.includes(focusedValue))
    .map(({ title, uri }) => {
      const name = title.length >= 50 ? title.substring(0, 50).padEnd(53, ".") : title

      return { name, value: uri };
    });

    return await interaction.respond(tracks);
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