import 'dotenv/config';

import { SpotiKunay } from "./client";

new SpotiKunay();

process.on('uncaughtExceptionMonitor', (err, origin) => console.error(err, origin));
process.on('unhandledRejection', (reason, promise) => console.error(reason, promise));

console.log('[CLIENT] Bot is Starting...');