import { Client } from "discord.js";
import { Node } from "erela.js";

export default class NodeDisconnect {
  type: string;
  
  constructor() {
    this.type = 'nodeDisconnect'; 
  }

  run(client: Client<true>, node: Node) {
    console.log(`[LAVALINK] ${node.options.identifier} | Desconectado.`);
    console.log(`[LAVALINK] ${node.options.identifier} | Reiniciando...`);

    return node.connect();
  }
 }