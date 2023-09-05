const {startVercel} = require('../src');

async function handle(req, res) {
  try {
    await startVercel(req, res);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
    console.error(e.message);
  }
}

module.exports = handle;

// const { Telegraf } = require('telegraf');
// const { getPageContent } = require('../services/FirebaseController');
// const VERCEL_URL = `${process.env.VERCEL_URL}`;
// const BOT_TOKEN = process.env.BOT_TOKEN || '';

// // Set up Telegram bot
// const bot = new Telegraf(BOT_TOKEN);

// bot.command('test', async (ctx) => {
//   try {
//     const data = await getPageContent('about', 'ru');
//     const formattedData = JSON.stringify(data, null, 2);
//     ctx.reply(`Data from Firestore:\n\n${formattedData}`);
//   } catch (error) {
//     console.log('Error:', error);
//     ctx.reply(`Error:\n\n${error}`);
//   }
// });

// // Set up webhook to receive updates
// bot.telegram.setWebhook(`${VERCEL_URL}/api`);

// // Start listening for incoming updates
// bot.startWebhook('/api', null, 3000); // Replace with the desired port

// console.log('Bot is listening...');
