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
            createLesson(ctx)
            .then(()=>{
                ctx.session.data.lang = 'ua';
                return createLesson(ctx)
            })
            .then((res)=>{
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
            .then(()=>{
                text('name',ctx);
            })
            .catch((err)=>{
                console.log(err)
                ctx.reply('Ошибка', endOptions)
            })
        }
    }
}

const addValue = async (ctx) => {
    const empty_filds = ctx.session.data.empty_filds;
    if (empty_filds.length !== 0) {
        await ctx.scene.leave()
        await ctx.reply(empty_filds[0].text, empty_filds[0].buttons)
        .then(()=>{
            if (empty_filds[0].type === 'text') {
                text(empty_filds[0].name, ctx)
            } else {
                number(empty_filds[0].name, ctx)
            }
        })
        .catch((err)=>console.log(err))
        ctx.session.data.empty_filds.shift();
    } else {
        ctx.reply('Все поля заполнены и сохранены');
        ctx.scene.leave();
    }
}

const identifier = async (ctx) => {
    if (ctx.session.data.page === 'parts') {
        getIdAndKey("lessons", ctx.message.text)
        .then((res)=>{
            ctx.session.data.lesson_id = res.id
            ctx.scene.enter('parts')
        })
        .catch((err)=>{
            console.log(err)
            ctx.reply('Ошибка', endOptions)
        })
    } else {
        if (ctx.session.data.change_type === 'edit') {
            getIdAndKey("lessons", ctx.message.text)
            .then((res)=>{
                ctx.session.data.lesson_id = res.id
                ctx.session.data.lesson_key = res.key
                ctx.session.data.old_content = res.content
                ctx.session.data.save = saveLesson;
            })
            .then(()=>ctx.reply('Выбери поле', lessonOptions))
            .catch((err)=>{
                console.log(err)
                ctx.reply('Ошибка', endOptions)
            })
        } else if (ctx.session.data.change_type === 'destroy') {
            ctx.session.data.lesson = ctx.message.text
            deleteLesson(ctx)
            .then(()=>{
                ctx.reply('Курс был успешно удалён')
                ctx.scene.leave();
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