const { Telegraf, Scenes, session } = require('telegraf');
const { getPageContent, uploadFileFromURL } = require('../services/FirebaseController');
const { end, create, edit, destroy, about, lessons, parts, skip, start } = require('../commands/main');
const { LessonsScene } = require('../scenes/LessonsScene');
const { PartsScene } = require('../scenes/PartsScene');
const { EnterValueScene, EnterValueRUScene, EnterValueUAScene } = require('../scenes/EnterValueScene');
const VERCEL_URL = `${process.env.VERCEL_URL}`;
const BOT_TOKEN = process.env.BOT_TOKEN || '';

// Set up Telegram bot
const bot = new Telegraf(BOT_TOKEN);


// const adminMiddleware = (ctx, next) => {
//   if(ctx.from.id == ADMIN_ID) {
//       next()
//   }
// }

const stage = new Scenes.Stage([
  LessonsScene,
  PartsScene,
  EnterValueScene,
  EnterValueRUScene,
  EnterValueUAScene
]);

// bot.use(adminMiddleware);
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

  // Usage example
  const globalFilePath = 'https://showgamer.com/storage/uploads/guides/2023-08-07/6f220833d0d03b3b3d7b294e0f53fd0d.jpg';
  const storageDestinationPath = 'files';
  const filename = 'example'; // Provide the desired filename here
  
  uploadFileFromURL(globalFilePath,null,storageDestinationPath)
  .then((publicUrl) => {
  // Do something with the public URL
  ctx.reply(`${publicUrl}`);
  })
  .catch((error) => {
  // Handle any errors
  ctx.reply(`${error}`);
  });    
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