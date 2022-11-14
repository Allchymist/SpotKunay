import Erela from 'erela.js';

declare module 'erela.js' {
  export interface PlayerOptions {
    messageId?: string;
  }
  export interface Player {
    messageId?: string;
  }
}