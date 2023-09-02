const { endOptions } = require('../../buttons');
const { uploadFileFromURL } = require('../../services/FirebaseController');

const enter = (ctx) => {
    if (ctx.session.data.next) {
        ctx.reply('Введите значение')
    } else {
        ctx.editMessageText('Введите значение')
    }
}

const enterRU = (ctx) => {
    if (ctx.session.data.content_now) {
        ctx.deleteMessage();
        ctx.replyWithHTML(ctx.session.data.content_now, endOptions).then(()=>{
            ctx.reply('Введите значение на русском')
        }).catch()
    } else {
        if (ctx.session.data.next) {
            ctx.reply('Введите значение на русском')
        } else {
            ctx.editMessageText('Введите значение на русском', endOptions)
        }
    }
}

const enterUA = (ctx) => {
    if (ctx.session.data.next) {
        ctx.reply('Введите значение на украинском')
    } else {
        ctx.reply('Введите значение на украинском', endOptions)
    }
}

const value = async (ctx) => {
    ctx.session.data.lang = "ru"
    ctx.session.data.save(ctx)
    .then(()=>{
        ctx.session.data.lang = "ua"
        ctx.session.data.save(ctx)
    })
    .then(()=>ctx.reply('Изменения приняты'))
    .then(()=>{
        if(ctx.session.data.next){
            ctx.session.data.next(ctx)
        } else {
            ctx.scene.leave()
        }
    })
    .catch((err)=>{
        console.log(err)
        ctx.reply('Ошибка', endOptions)
    })
}

const valueRU = async (ctx) => {
    ctx.session.data.lang = "ru";
    ctx.session.data.save(ctx)
    .then(()=>ctx.reply('Изменения приняты'))
    .then(()=>ctx.scene.enter('value_ua'))
    .catch((err)=>{
        console.log(err)
        ctx.reply('Ошибка', endOptions)
    })
}

const valueUA = async (ctx) => {
    const next = ctx.session.data.next ? ctx.session.data.next : ctx.scene.leave;
    ctx.session.data.lang = "ua";
    ctx.session.data.save(ctx)
    .then(()=>ctx.reply('Изменения приняты'))
    .then(()=>{
        if(ctx.session.data.next){
            ctx.session.data.next(ctx)
        } else {
            ctx.scene.leave()
        }
    })
    .catch((err)=>{
        console.log(err)
        ctx.reply('Ошибка', endOptions)
    })
}

const document = async (ctx) => {
    if(ctx.session.data.changed_field==='image'){
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