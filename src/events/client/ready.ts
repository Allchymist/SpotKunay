import { Client, ClientEvents } from "discord.js";

import { DeployCommand, DeployCommandDevMode } from "../../commands/DeployCommands";

export default class Ready {
  type: keyof ClientEvents;

  constructor() {
    this.type = 'ready';
  }

  async execute(client: Client<true>) {
    client.manager.init(client.user.id);

    if (process.env.MODE_APP == 'DEV') {
      await DeployCommandDevMode(client);
    } else {
      await DeployCommand(client);
    }

    console.log(`[CLIENT] ${client.user.tag} is ready!`);
  }
}