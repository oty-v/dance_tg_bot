// const {startVercel} = require('../src');

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

const Telegraf = require('telegraf');
const { getPageContent } = require('../services/FirebaseController');
const VERCEL_URL = `${process.env.VERCEL_URL}`;
const BOT_TOKEN = process.env.BOT_TOKEN || '';

// Initialize Telegraf bot
const bot = new Telegraf(BOT_TOKEN);

// Configure the Telegram bot command
bot.command('test', async (ctx) => {
  const message = ctx.message.text;
  const data = await getPageContent("about", "ru");
  ctx.reply(`You said: ${message}. Data from Firebase: ${JSON.stringify(data)}`);
});

// Start the bot
bot.telegram.setWebhook(`${VERCEL_URL}/api/${BOT_TOKEN}`);

async function webhookHandler(event) {
  try {
    await bot.handleUpdate(event.body);
    return {
      statusCode: 200,
      body: '',
    };
  } catch (error) {
    console.error('Error handling webhook update:', error);
    return {
      statusCode: 500,
      body: 'Error handling webhook update',
    };
  }
}

module.exports = { webhookHandler };