require('dotenv').config();
const { Telegraf, Scenes, session } = require('telegraf');
const { LessonsScene } = require('./scenes/LessonsScene');
const { start, edit, about, lessons, parts, create, destroy, end, skip } = require('./commands/main');
const { EnterValueScene, EnterValueRUScene, EnterValueUAScene } = require('./scenes/EnterValueScene');
const { PartsScene } = require('./scenes/PartsScene');
const { uploadFileFromURL, deleteFile } = require('./services/FirebaseController');

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
    {command: "/test", description: "Тест"},
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

bot.command('test', async (ctx) => {

    // Usage example
    const globalFilePath = 'https://showgamer.com/storage/uploads/guides/2023-08-07/6f220833d0d03b3b3d7b294e0f53fd0d.jpg';
    const storageDestinationPath = 'files';
    const filename = 'example'; // Provide the desired filename here
    
    deleteFile(storageDestinationPath)
    .then((publicUrl) => {
    // Do something with the public URL
    })
    .catch((error) => {
    // Handle any errors
    });    
})

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));