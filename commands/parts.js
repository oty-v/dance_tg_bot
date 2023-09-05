const { partOptions, endOptions, skipOptions } = require("../buttons");
const { createPart, savePart, deletePart } = require("./helpers/parts");
const { addValue } = require("./lessons");
const { text, number } = require('../commands/lessons');
const { getSubPageContent } = require("../services/FirebaseController");

const enter = async (ctx) => {
    if ((ctx.session.data.change_type === 'edit')||(ctx.session.data.change_type === 'destroy')) {
        await ctx.reply('Укажи имя урока', endOptions)
    } else if (ctx.session.data.change_type === 'create') {
        await value(ctx)
    }
}

const identifier = async (ctx) => {
    if (ctx.session.data.change_type === 'edit') {
        ctx.session.data.part = ctx.message.text
        const lesson_id = ctx.session.data.lesson_id;
        await getSubPageContent('lessons', lesson_id, 'ru')
        .then(async (oldContent)=>{
            ctx.session.data.part_key = await oldContent.parts.findIndex((item) => {
                return item.name.toLowerCase() === ctx.session.data.part.toLowerCase()
            });
            if (!!oldContent.parts.id) {ctx.session.data.part_id = oldContent.parts.id};
        })
        .then(async (res)=>{
            if(res === -1){
                await ctx.reply('Такого урока нет', endOptions)
            }
        })
        .catch((err)=> {
            ctx.reply('Ошибка', endOptions)
            console.log(err)
            return err;
        })
        ctx.session.data.save = savePart;
        await ctx.reply('Выбери поле', partOptions)
    } else if (ctx.session.data.change_type === 'destroy') {
        ctx.session.data.part = ctx.message.text
        await deletePart(ctx);
        await ctx.reply('Успешно удалено!')
        await ctx.scene.leave();
    }
}

const value = async (ctx) => {
    if (!ctx.session.data.change) {
        ctx.session.data.change = {};
        ctx.session.data.lang = 'ru';
        await createPart(ctx)
        .then(async ()=>{
            ctx.session.data.lang = 'ua';
            return await createPart(ctx)
        })
        .then(async (res)=>{
            ctx.session.data.part_key = res.key
            ctx.session.data.part_id = res.id
            ctx.session.data.save = savePart;
            ctx.session.data.empty_filds = [
                {type: 'text', name: 'info', text: 'Введите краткую информацию карточки урока'},
                {type: 'text', name: 'time', text: 'Введите время урока'},
                {type: 'number', name: 'url', text: 'Введите ссылку на урок если необходимо', buttons: skipOptions},
                {type: 'number', name: 'image', text: 'Введите ссылку на картинку урока'},
                {type: 'number', name: 'number', text: 'Введите порядковый номер урока в списке'}
            ]
            ctx.session.data.next = addValue;
            await ctx.reply('Введите название урока');
        })
        .then(async()=>{
            await text('name',ctx);
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