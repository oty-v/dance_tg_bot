require('dotenv').config();
const { Telegraf, Scenes, session } = require('telegraf');
const { start, edit, about, lessons, parts, create, destroy, end, skip } = require('../commands/main');
const { EnterValueScene, EnterValueRUScene, EnterValueUAScene } = require('../scenes/EnterValueScene');
const { PartsScene } = require('../scenes/PartsScene');
const { LessonsScene } = require('../scenes/LessonsScene');
const development = require('./core/development');
const production = require('./core/prodaction');
const { getPageContent } = require('../services/FirebaseController');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';
const ADMIN_ID = process.env.ADMIN_ID || '';

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
bot.command('test', async (ctx)=>{
    const chat = ctx.chat.id;
    bot.telegram.sendMessage(chat, ctx.chat.id)
    const res = await getPageContent('about', 'ru')
    bot.telegram.sendMessage(chat, JSON.stringify(res))
})
bot.action('end', end)
bot.action('create', create)
bot.action('edit', edit)
bot.action('destroy', destroy)
bot.action('about', about)
bot.action('lessons', lessons)
bot.action('parts', parts)
bot.action('skip', skip)

//prod mode (Vercel)
const startVercel = async (req, res) => {
  await production(req, res, bot);
};
bot.launch();
//dev mode
ENVIRONMENT !== 'production' && development(bot);

module.exports = {startVercel};