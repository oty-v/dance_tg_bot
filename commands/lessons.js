const { lessonOptions, endOptions } = require("../buttons");
const { getIdAndKey } = require("../services/FirebaseController");
const { updateSession, getSession } = require("../services/MongoDBController");
const { saveLesson, createLesson } = require("./helpers");
const { deleteLesson } = require("./helpers/lessons");

const enter = async (ctx) => {
    const session = getSelection(ctx.catch.id);
    if (
        (session.change_type === 'edit')||
        (session.page === 'parts')||
        (session.change_type === 'destroy')
        ) {
        await ctx.editMessageText('Укажи название курса', endOptions)
    } else if (session.change_type === 'create') {
        if (!session.change) {
            session.change = {};
            session.lang = 'ru';
            createLesson(session)
            .then(()=>{
                session.lang = 'ua';
                return createLesson(session)
            })
            .then((res)=>{
                session.lesson_id = res.id
                session.lesson_key = res.key
                session.empty_filds = [
                    {type: 'text', name: 'card_info', text: 'Введите краткую информацию карточки курса'},
                    {type: 'text', name: 'info', text: 'Введите общую информацию курса'},
                    {type: 'text', name: 'price_info', text: 'Введите краткую информацию прайс листа курса'},
                    {type: 'text', name: 'time', text: 'Введите общее время курса'},
                    {type: 'number', name: 'price', text: 'Введите общую цену курса'},
                    {type: 'number', name: 'image', text: 'Введите ссылку на картинку курса'},
                    {type: 'number', name: 'number', text: 'Введите порядковый номер курса в списке'}
                ]
                session.next = true;
                updateSession(ctx.catch.id, session);
                ctx.reply('Введите имя курса');
            })
            .then(()=>{
                text('name',ctx);
            })
            .catch((err)=>{
                console.log(err)
                ctx.reply(`Ошибка: ${err}`, endOptions)
            })
        }
    }
}

const addValue = async (ctx) => {
    const session = getSession(ctx.catch.id);
    const empty_filds = session.empty_filds;
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
        session.empty_filds.shift();
        updateSession(ctx.catch.id, session);
    } else {
        ctx.reply('Все поля заполнены и сохранены');
        ctx.scene.leave();
    }
}

const identifier = async (ctx, session) => {
    if (session.page === 'parts') {
        getIdAndKey("lessons", ctx.message.text)
        .then((res)=>{
            session.lesson_id = res.id
            ctx.scene.enter('parts')
        })
        .catch((err)=>{
            console.log(err)
            ctx.reply('Ошибка', endOptions)
        })
    } else {
        if (session.change_type === 'edit') {
            getIdAndKey("lessons", ctx.message.text)
            .then((res)=>{
                session.lesson_id = res.id
                session.lesson_key = res.key
                session.old_content = res.content
            })
            .then(()=>ctx.reply('Выбери поле', lessonOptions))
            .catch((err)=>{
                console.log(err)
                ctx.reply('Ошибка', endOptions)
            })
        } else if (session.change_type === 'destroy') {
            session.lesson = ctx.message.text
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
    updateSession(ctx.catch.id, {changed_field: name})
    await ctx.scene.enter('value_ru')
}

const number = async (name, ctx) => {
    updateSession(ctx.catch.id, {changed_field: name})
    await ctx.scene.enter('value')
}

module.exports = {
    enter,
    identifier,
    text,
    number,
    addValue
}