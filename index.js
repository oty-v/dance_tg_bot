require('dotenv').config();
const { Telegraf, Scenes, session } = require('telegraf');
const { LessonsScene } = require('./scenes/LessonsScene');
const { start, edit, about, lessons, parts, create, destroy, end, skip } = require('./commands/main');
const { EnterValueScene, EnterValueRUScene, EnterValueUAScene } = require('./scenes/EnterValueScene');
const { PartsScene } = require('./scenes/PartsScene');

const bot = new Telegraf(process.env.BOT_TOKEN);

const adminMiddleware = (ctx, next) => {
    if(ctx.from.id == process.env.ADMIN_ID) {
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
    {command: "/end", description: "Выйти"}
])

bot.start(start)

bot.command('end', end)
bot.action('end', end)
bot.action('create', create)
bot.action('edit', edit)
bot.action('destroy', destroy)
bot.action('about', about)
bot.action('lessons', lessons)
bot.action('parts', parts)
bot.action('skip', skip)

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));