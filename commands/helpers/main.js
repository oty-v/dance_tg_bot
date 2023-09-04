const { session } = require('telegraf');
const { endOptions } = require('../../buttons');
const { uploadFileFromURL } = require('../../services/FirebaseController');
const save = require('../save');
const { addValue } = require('../lessons');

const enter = (ctx) => {
    if (session.next) {
        ctx.reply('Введите значение')
    } else {
        ctx.editMessageText('Введите значение')
    }
}

const enterRU = (ctx) => {
    if (session.content_now) {
        ctx.deleteMessage();
        ctx.replyWithHTML(session.content_now, endOptions).then(()=>{
            ctx.reply('Введите значение на русском')
        }).catch()
    } else {
        if (session.next) {
            ctx.reply('Введите значение на русском')
        } else {
            ctx.editMessageText('Введите значение на русском', endOptions)
        }
    }
}

const enterUA = (ctx) => {
    if (session.next) {
        ctx.reply('Введите значение на украинском')
    } else {
        ctx.reply('Введите значение на украинском', endOptions)
    }
}

const value = (ctx) => {
    session.lang = "ru"
    save(session.page, ctx)
    .then(()=>{
        session.lang = "ua"
        save(ctx)
    })
    .then(()=>ctx.reply('Изменения приняты'))
    .then(()=>{
        if(session.next){
            addValue(ctx)
        } else {
            ctx.scene.leave()
        }
    })
    .catch((err)=>{
        console.log(err)
        ctx.reply(`Ошибка: ${err}`, endOptions)
    })
}

const valueRU = async (ctx) => {
    session.lang = "ru";
    save(session.page, ctx)
    .then(()=>ctx.reply('Изменения приняты'))
    .then(()=>ctx.scene.enter('value_ua'))
    .catch((err)=>{
        console.log(err)
        ctx.reply('Ошибка', endOptions)
    })
}

const valueUA = async (ctx) => {
    session.lang = "ua";
    save(session.page, ctx)
    .then(()=>ctx.reply('Изменения приняты'))
    .then(()=>{
        if(session.next){
            addValue(ctx)
        } else {
            ctx.scene.leave()
        }
    })
    .catch((err)=>{
        console.log(err)
        ctx.reply('Ошибка', endOptions)
    })
}

const document = async (ctx, session) => {
    if(session.changed_field==='image'){
        if(ctx.update.message.document){
            const {file_id: fileId} = ctx.update.message.document;
            const fileUrl = await ctx.telegram.getFileLink(fileId);
            uploadFileFromURL(fileUrl.href)
            .then((path)=>{
                ctx.message.text = path;
                value(ctx);
            })
            .catch((err)=>{
                console.log(err);
                throw err;
            })
        } else {
            ctx.reply('Отправте картинку без сжатия!')
        }
    }
  }

module.exports = {
    enter,
    enterRU,
    enterUA,
    value,
    valueRU,
    valueUA,
    document
}