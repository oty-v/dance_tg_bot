const { getPageContent } = require('../services/FirebaseController');
const { startOptions, pagesOptions, createPagesOptions } = require('../buttons');
const { limitStr, saveAbout } = require('./helpers');

const start = async (ctx) => {
    await ctx.scene.leave()
    ctx.session.data = {};
    await ctx.reply('Добро пожаловать', startOptions);
}

const end = async (ctx) => {
    await ctx.deleteMessage();
    await ctx.scene.leave()
    ctx.session.data = {};
    await ctx.reply('Пока');
}

const create = async (ctx) => {
    ctx.session.data.change_type = 'create';
    await ctx.editMessageText('Выбери какой элемент будет создаваться', createPagesOptions)
}

const edit = async (ctx) => {
    ctx.session.data.change_type = 'edit';
    await ctx.editMessageText('Выбери страницу на которой будут происходить изменения', pagesOptions)
}

const destroy = async (ctx) => {
    ctx.session.data.change_type = 'destroy';
    await ctx.editMessageText('Выбери страницу на которой будут происходить изменения', createPagesOptions)
}

const about = async (ctx) => {
    ctx.session.data.page = 'about';
    await getPageContent('about')
    .then(async (content)=>{
        ctx.session.data.content_now = 
                `Информация на данной странице сейчас:\n\n`+
                `<b>На Русском:</b>\n\n<i>${limitStr(content.ru.info, 250)}</i>\n\n`+
                `<b>На Украинском:</b>\n\n<i>${limitStr(content.ua.info, 250)}</i>`;
        ctx.session.data.save = saveAbout;
        await ctx.scene.enter('value_ru')
    })
    .catch((err)=>{
        ctx.reply(`Ошибка: ${err}`, endOptions);
    })
}

const lessons = async (ctx) => {
    ctx.session.data.page = 'lessons';
    await ctx.scene.enter('lessons')
}

const parts = async (ctx) => {
    ctx.session.data.page = 'parts';
    await ctx.scene.enter('lessons')
}

const skip = async (ctx) => {
    if(ctx.session.data.next){
        await ctx.session.data.next(ctx)
    } else {
        await ctx.scene.leave()
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