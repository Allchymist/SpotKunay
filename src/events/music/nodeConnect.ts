import { Client } from "discord.js";
import { Node } from "erela.js";

export default class NodeConnect {
  type: string;
  
  constructor() {
    this.type = 'nodeConnect'; 
  }

  execute(client: Client<true>, node: Node) {
    console.log(`[LAVALINK] ${node.options.identifier} | Connected`);
  }
}