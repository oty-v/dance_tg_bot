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

const { Telegraf, Scenes, session } = require('telegraf');
const { getPageContent } = require('../services/FirebaseController');
const { end, create, edit, destroy, about, lessons, parts, skip } = require('../commands/main');
const { LessonsScene } = require('../scenes/LessonsScene');
const { PartsScene } = require('../scenes/PartsScene');
const { EnterValueScene, EnterValueRUScene, EnterValueUAScene } = require('../scenes/EnterValueScene');
const VERCEL_URL = `${process.env.VERCEL_URL}`;
const BOT_TOKEN = process.env.BOT_TOKEN || '';

// Set up Telegram bot
const bot = new Telegraf(BOT_TOKEN);


const adminMiddleware = (ctx, next) => {
  if(ctx.from.id == ADMIN_ID) {
      next()
  }
}

const stage = new Scenes.Stage([
  LessonsScene,
  PartsScene,
  EnterValueScene,
  EnterValueRUScene,
  EnterValueUAScene
]);

bot.use(adminMiddleware);
bot.use(session({ collectionName: 'session' }));
bot.use(stage.middleware());

bot.telegram.setMyCommands([
  {command: "/start", description: "Начать"},
  {command: "/end", description: "Выйти"},
  {command: "/test", description: "Test"}
])

bot.start(start)

bot.command('end', end)
bot.command('test', async (ctx) => {
try {
  const data = await getPageContent('about', 'ru');
  const formattedData = JSON.stringify(data, null, 2);
  ctx.reply(`Data from Firestore:\n\n${formattedData}`);
} catch (error) {
  console.log('Error:', error);
  ctx.reply('Failed to get data from Firebase.');
}
})
bot.action('end', end)
bot.action('create', create)
bot.action('edit', edit)
bot.action('destroy', destroy)
bot.action('about', about)
bot.action('lessons', lessons)
bot.action('parts', parts)
bot.action('skip', skip)

// Set up webhook to receive updates
bot.telegram.setWebhook(`${VERCEL_URL}/api`);

// Start listening for incoming updates
bot.startWebhook('/api', null, 3000); // Replace with the desired port

console.log('Bot is listening...');
