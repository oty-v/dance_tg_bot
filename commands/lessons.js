const { lessonOptions, endOptions } = require("../buttons");
const { getIdAndKey } = require("../services/FirebaseController");
const { saveLesson, createLesson } = require("./helpers");
const { deleteLesson } = require("./helpers/lessons");

const enter = async (ctx) => {
    if (
        (ctx.session.data.change_type === 'edit')||
        (ctx.session.data.page === 'parts')||
        (ctx.session.data.change_type === 'destroy')
        ) {
        await ctx.editMessageText('Укажи название курса', endOptions)
    } else if (ctx.session.data.change_type === 'create') {
        if (!ctx.session.data.change) {
            ctx.session.data.change = {};
            ctx.session.data.lang = 'ru';
            await createLesson(ctx)
            .then(async ()=>{
                ctx.session.data.lang = 'ua';
                return await createLesson(ctx)
            })
            .then(async (res)=>{
                ctx.session.data.lesson_id = res.id
                ctx.session.data.lesson_key = res.key
                ctx.session.data.save = saveLesson;
                ctx.session.data.empty_filds = [
                    {type: 'text', name: 'card_info', text: 'Введите краткую информацию карточки курса'},
                    {type: 'text', name: 'info', text: 'Введите общую информацию курса'},
                    {type: 'text', name: 'price_info', text: 'Введите краткую информацию прайс листа курса'},
                    {type: 'text', name: 'time', text: 'Введите общее время курса'},
                    {type: 'number', name: 'price', text: 'Введите общую цену курса'},
                    {type: 'number', name: 'image', text: 'Введите ссылку на картинку курса'},
                    {type: 'number', name: 'number', text: 'Введите порядковый номер курса в списке'}
                ]
                ctx.session.data.next = addValue;
                ctx.reply('Введите имя курса');
            })
            .then(async ()=>{
                await text('name',ctx);
            })
            .catch((err)=>{
                console.log(err)
                ctx.reply(`Ошибка: ${err}`, endOptions)
            })
        }
    }
}

const addValue = async (ctx) => {
    const empty_filds = ctx.session.data.empty_filds;
    if (empty_filds.length !== 0) {
        await ctx.scene.leave()
        await ctx.reply(empty_filds[0].text, empty_filds[0].buttons)
        .then(async ()=>{
            if (empty_filds[0].type === 'text') {
                await text(empty_filds[0].name, ctx)
            } else {
                await number(empty_filds[0].name, ctx)
            }
        })
        .catch((err)=>console.log(err))
        ctx.session.data.empty_filds.shift();
    } else {
        ctx.reply('Все поля заполнены и сохранены');
        await ctx.scene.leave();
    }
}

const identifier = async (ctx) => {
    if (ctx.session.data.page === 'parts') {
        await getIdAndKey("lessons", ctx.message.text)
        .then(async (res)=>{
            ctx.session.data.lesson_id = res.id
            await ctx.scene.enter('parts')
        })
        .catch((err)=>{
            console.log(err)
            ctx.reply('Ошибка', endOptions)
        })
    } else {
        if (ctx.session.data.change_type === 'edit') {
            await getIdAndKey("lessons", ctx.message.text)
            .then((res)=>{
                ctx.session.data.lesson_id = res.id
                ctx.session.data.lesson_key = res.key
                ctx.session.data.old_content = res.content
                ctx.session.data.save = saveLesson;
            })
            .then(async ()=>await ctx.reply('Выбери поле', lessonOptions))
            .catch((err)=>{
                console.log(err)
                ctx.reply('Ошибка', endOptions)
            })
        } else if (ctx.session.data.change_type === 'destroy') {
            ctx.session.data.lesson = ctx.message.text
            await deleteLesson(ctx)
            .then(async ()=>{
                ctx.reply('Курс был успешно удалён')
                await ctx.scene.leave();
            })
            .catch((err)=>{
                console.log(err)
                ctx.reply('Ошибка', endOptions)
            })
        }
    }
}

const text = async (name, ctx) => {
    ctx.session.data.changed_field = name;
    await ctx.scene.enter('value_ru')
}

const number = async (name, ctx) => {
    ctx.session.data.changed_field = name;
    await ctx.scene.enter('value')
}

module.exports = {
    enter,
    identifier,
    text,
    number,
    addValue
}