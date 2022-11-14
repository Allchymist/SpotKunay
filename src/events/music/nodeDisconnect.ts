import { Client } from "discord.js";
import { Node } from "erela.js";

export default class NodeDisconnect {
  type: string;
  
  constructor() {
    this.type = 'nodeDisconnect'; 
  }

  execute(client: Client<true>, node: Node) {
    console.log(`[LAVALINK] ${node.options.identifier} | Disconnected`);
  }
}