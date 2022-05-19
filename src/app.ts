import Client from "./client";
import 'dotenv/config';
new Client();

process.on('unhandledRejection', (reason, promise) => {
  const { message } = reason as Error;
  console.error(message);
});