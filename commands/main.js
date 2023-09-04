const { getPageContent } = require('../services/FirebaseController');
const { startOptions, pagesOptions, createPagesOptions } = require('../buttons');
const { limitStr } = require('./helpers');
const { updateSession, getSession, deleteSession } = require('../services/MongoDBController');
const { addValue } = require('./lessons');

const start = async (ctx) => {
    await ctx.scene.leave();
    await ctx.reply('Добро пожаловать', startOptions);
}

const end = async (ctx) => {
    await deleteSession(ctx.catch.id);
    await ctx.deleteMessage();
    await ctx.scene.leave();
    await ctx.reply('Пока');
}
const cedConstructor = (ctx, type, txt, kb) => {
    const chat_id = ctx.chat.id;
    const session = {
        change_type: type
    }
    const result = updateSession(chat_id, session)
    if (result) {
        ctx.editMessageText(txt, kb)
    } else {
        console.log(err)
        ctx.reply('Ошибка', endOptions)
    };
}

const sceneEnterConstructor = (ctx, name, type) => {
    const chat_id = ctx.chat.id;
    const session = {
        page: name
    }
    const result = updateSession(chat_id, session)
    if (result) {
        ctx.scene.enter(type)
    } else {
        console.log(err)
        ctx.reply('Ошибка', endOptions)
    };
}

const create = async (ctx) => {
    await cedConstructor(ctx, 'create', 'Выбери какой элемент будет создаваться', createPagesOptions);
}

const edit = async (ctx) => {
    await cedConstructor(ctx, 'edit', 'Выбери страницу на которой будут происходить изменения', pagesOptions);
}

const destroy = async (ctx) => {
    await cedConstructor(ctx, 'destroy', 'Выбери страницу на которой будут происходить изменения', createPagesOptions);
}

const about = (ctx) => {
    getPageContent('about')
    .then((content)=>{
        const chat_id = ctx.chat.id;
        const session = {
            page: 'about',
            content_now:
            `Информация на данной странице сейчас:\n\n
            <b>На Русском:</b>\n\n<i>${limitStr(content.ru.info, 250)}</i>\n\n
            <b>На Украинском:</b>\n\n<i>${limitStr(content.ua.info, 250)}</i>`

        }
        updateSession(chat_id, session);
    })
    .then(()=>{
        ctx.scene.enter('value_ru');
    })
    .catch((err)=>{
        ctx.reply(`Ошибка: ${err}`, endOptions);
    })
}

const lessons = async (ctx) => {
    await sceneEnterConstructor(ctx, 'lessons', 'lessons');
}

const parts = async (ctx) => {
    await sceneEnterConstructor(ctx, 'parts', 'lessons');
}

const skip = async (ctx) => {
    const chat_id = ctx.chat.id;
    const session = getSession(chat_id)
    if(session.next){
        addValue(ctx)
    } else {
        ctx.scene.leave()
    }
}

module.exports = {
    start,
    end,
    create,
    edit,
    destroy,
    about,
    lessons,
    parts,
    skip
}