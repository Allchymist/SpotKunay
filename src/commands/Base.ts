import { ApplicationCommandDataResolvable, PermissionString } from "discord.js";

export default class  Command {
  protected data: ApplicationCommandDataResolvable;
  protected bot_perm: PermissionString | PermissionString[];
  protected user_perm: PermissionString | PermissionString[];
  protected dj_perm: boolean;
  protected cooldown: number;
  protected inVoiceChannel: boolean
}
