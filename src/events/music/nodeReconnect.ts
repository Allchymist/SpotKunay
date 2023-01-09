import { Client } from "discord.js";
import { Node } from 'erela.js';

export default class NodeReconnect {
  type: string;
  
  constructor() {
    this.type = 'nodeReconnect'; 
  }

  execute(client: Client<true>, node: Node) {
    console.log(`[LAVALINK] ${node.options.identifier} | Reconnecting`);
  }
}
