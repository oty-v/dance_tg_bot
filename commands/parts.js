const { partOptions, endOptions, skipOptions } = require("../buttons");
const { createPart, savePart, deletePart } = require("./helpers/parts");
const { text, number } = require('../commands/lessons');
const { getSubPageContent } = require("../services/FirebaseController");
const { updateSession } = require("../services/MongoDBController");

const enter = async (ctx) => {
    const session = getSelection(ctx.catch.id);
    if ((session.change_type === 'edit')||(session.change_type === 'destroy')) {
        await ctx.reply('Укажи имя урока', endOptions)
    } else if (session.change_type === 'create') {
        value(ctx, session);
    }
}

const identifier = async (ctx) => {
    const session = getSelection(ctx.catch.id);
    if (session.change_type === 'edit') {
        session.part = ctx.message.text
        const lesson_id = session.lesson_id;
        getSubPageContent('lessons', lesson_id, 'ru')
        .then((oldContent)=>{
            session.part_key = oldContent.parts.findIndex((item) => {
                return item.name.toLowerCase() === session.part.toLowerCase()
            });
            if (!!oldContent.parts.id) {session.part_id = oldContent.parts.id};
        })
        .then((res)=>{
            if(res === -1){
                ctx.reply('Такого урока нет', endOptions)
            }
        })
        .catch((err)=> {
            ctx.reply('Ошибка', endOptions)
            console.log(err)
            return err;
        })
        await ctx.reply('Выбери поле', partOptions)
    } else if (session.change_type === 'destroy') {
        session.part = ctx.message.text
        await deletePart(session);
        await ctx.reply('Успешно удалено!')
        await ctx.scene.leave();
    }
    updateSession(ctx.catch.id, session);
}

const value = async (ctx, session) => {
    if (!session.change) {
        session.change = {};
        session.lang = 'ru';
        createPart(ctx)
        .then(()=>{
            session.lang = 'ua';
            return createPart(ctx)
        })
        .then((res)=>{
            session.part_key = res.key
            session.part_id = res.id
            session.empty_filds = [
                {type: 'text', name: 'info', text: 'Введите краткую информацию карточки урока'},
                {type: 'text', name: 'time', text: 'Введите время урока'},
                {type: 'number', name: 'url', text: 'Введите ссылку на урок если необходимо', buttons: skipOptions},
                {type: 'number', name: 'image', text: 'Введите ссылку на картинку урока'},
                {type: 'number', name: 'number', text: 'Введите порядковый номер урока в списке'}
            ]
            session.next = true;
            updateSession(ctx.catch.id, session);
            ctx.reply('Введите название урока');
        })
        .then(()=>{
            text('name',ctx);
        })
        .catch((err)=>{
            console.log(err)
            ctx.reply('Ошибка', endOptions)
        })
    }
}

module.exports = {
    enter,
    identifier,
    value,
    text,
    number
}