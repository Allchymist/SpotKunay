import { ApplicationCommandData, Client, ChatInputCommandInteraction, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import { search } from 'music-lyrics';

import moment from "moment";
import 'moment-duration-format';

export default class Lyrics {
  data: ApplicationCommandData;
  cooldown: number;

  constructor() {
    this.data = {
      name: 'lyrics',
      description: 'Letra da música tocando ou especifica.',
      options: [{
        name: 'title',
        description: '🌟 Nome da música',
        type: ApplicationCommandOptionType.String,
      }]
    }

    this.cooldown = 10;
  }

  async execute(client: Client, interaction: ChatInputCommandInteraction) {
    let title = interaction.options.getString('title');

    if (!title) {
      const player = client.manager.get(interaction.guildId);
      if (!player) return interaction.editReply('Não há músicas tocando');

      const current = player.queue.current;
      if (!current) return interaction.editReply('Não há músicas tocando agora');

      title = current.title;
    }

    try {
      const result: string = await search(title);

      const embeds = pageSystem(result);
      let currentIndex = 0;

      if (embeds.length < 2) return interaction.editReply({ embeds: [embeds[currentIndex]] });

      let row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('back4')
            .setEmoji('⬅')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId('next4')
            .setEmoji('➡')
            .setStyle(ButtonStyle.Secondary)
        );
      
      interaction.editReply({
        embeds: [embeds[currentIndex]],
        components: [row]
      });

      const collector = interaction.channel.createMessageComponentCollector({
        filter: int => int.user.id == interaction.user.id && ["back4", "next4"].includes(int.customId),
        time: 60000, componentType: ComponentType.Button
      });

      collector.on('collect', (int) => {
        int.customId === 'back4' ? currentIndex-- : ++currentIndex;

        row = new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('back4')
              .setEmoji('⬅')
              .setStyle(ButtonStyle.Secondary)
              .setDisabled(currentIndex !== 0 ? false : true),
            new ButtonBuilder()
            .setCustomId('next4')
            .setEmoji('➡')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentIndex + 1 < embeds.length ? false : true)
          );

        int.update({
          embeds: [embeds[currentIndex]],
          components: [row]
        });
      });

    } catch (err) {
      console.error(err);

      return interaction.editReply({
        embeds: [{
          title: 'Ocorreu um erro ao procurar letra da música.',
          description: err.message
        }]
      });
    }
  }
}

function pageSystem(args: string) {
  const embeds = []
  let amount = 40;
  let split = args.split('\n');

  for (let i = 0; i < split.length; i += 40) {
    const current = split.slice(i, amount).join('\n');
    let currentPage = amount / 40;
    let maxPage = parseInt(`${split.length / parseFloat('40') + 0.99}`);
    amount += 40;
    
    embeds.push({
      color: 'BLUE',
      description: current,
      footer: { text: maxPage > 1 ? `Página: ${currentPage} / ${maxPage}` : "Apenas 1 Página" },
    });
  }
  
  return embeds;
}