const { Telegraf } = require('telegraf');
const { getPageContent } = require('../services/FirebaseController');
require('dotenv').config();

// Initialize Telegraf bot using the Telegram API token
const bot = new Telegraf(process.env.BOT_TOKEN);

// Register a webhook URL for Telegram updates
bot.telegram.setWebhook(`${process.env.VERCEL_URL}/api/telegram/webhook`);

bot.telegram.setMyCommands([
  {command: "/test", description: "Test"}
])
// Telegram webhook handler
bot.command('test', async (ctx) => {
  try {
    const data = await getPageContent('about');
    if (data.length > 0) {
      const formattedData = JSON.stringify(data, null, 2);
      ctx.reply(`Data from Firestore:\n\n${formattedData}`);
    } else {
      ctx.reply('No data available.');
    }
  } catch (error) {
    console.log('Error:', error);
    ctx.reply('Failed to get data from Firebase.');
  }
});


// Vercel serverless function for Telegram webhook
module.exports = async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).end();
  } catch (error) {
    console.log('Error:', error);
    res.status(500).end('Internal Server Error');
  }
};

// const { startVercel } = require('../src');

// async function handle(req, res) {
//   try {
//     await startVercel(req, res);
//   } catch (e) {
//     res.statusCode = 500;
//     res.setHeader('Content-Type', 'text/html');
//     res.end('<h1>Server Error</h1><p>Sorry, there was a problem</p>');
//     console.error(e.message);
//   }
// }

// module.exports = handle;