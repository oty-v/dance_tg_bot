// require('dotenv').config();
// const { Telegraf, Scenes, session } = require('telegraf');
// const { start, edit, about, lessons, parts, create, destroy, end, skip } = require('../commands/main');
// const { EnterValueScene, EnterValueRUScene, EnterValueUAScene } = require('../scenes/EnterValueScene');
// const { PartsScene } = require('../scenes/PartsScene');
// const { LessonsScene } = require('../scenes/LessonsScene');
// const development = require('./core/development');
// const production = require('./core/prodaction');
// const { getPageContent } = require('../services/FirebaseController');

// // Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));
// const BOT_TOKEN = process.env.BOT_TOKEN || '';
// const ENVIRONMENT = process.env.NODE_ENV || '';
// const ADMIN_ID = process.env.ADMIN_ID || '';

// const bot = new Telegraf(BOT_TOKEN);

// const adminMiddleware = (ctx, next) => {
//     if(ctx.from.id == ADMIN_ID) {
//         next()
//     }
// }

// const stage = new Scenes.Stage([
//     LessonsScene,
//     PartsScene,
//     EnterValueScene,
//     EnterValueRUScene,
//     EnterValueUAScene
// ]);

// bot.use(adminMiddleware);
// bot.use(session({ collectionName: 'session' }));
// bot.use(stage.middleware());

// bot.telegram.setMyCommands([
//     {command: "/start", description: "Начать"},
//     {command: "/end", description: "Выйти"},
//     {command: "/test", description: "Test"}
// ])

// bot.start(start)

// bot.command('end', end)
// bot.command('test', async (ctx) => {
//     const data = await getPageContent("about");
  
//     if (data.length > 0) {
//       const formattedData = JSON.stringify(data, null, 2);
//       ctx.reply(`Data from Firestore:\n\n${formattedData}`);
//     } else {
//       ctx.reply('No data available.');
//     }
//   })
// bot.action('end', end)
// bot.action('create', create)
// bot.action('edit', edit)
// bot.action('destroy', destroy)
// bot.action('about', about)
// bot.action('lessons', lessons)
// bot.action('parts', parts)
// bot.action('skip', skip)

// //prod mode (Vercel)
// const startVercel = async (req, res) => {
//   await production(req, res, bot);
// };
// //dev mode
// ENVIRONMENT !== 'production' && development(bot);

// module.exports = {startVercel};

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
    const data = await getPageContent('about', 'ru');
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