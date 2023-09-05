const { endOptions } = require('../../buttons');
const { uploadFileFromURL } = require('../../services/FirebaseController');

const enter = async (ctx) => {
    if (ctx.session.data.next) {
        await ctx.reply('Введите значение')
    } else {
        await ctx.editMessageText('Введите значение')
    }
}

const enterRU = async (ctx) => {
    if (ctx.session.data.content_now) {
        await ctx.deleteMessage();
        ctx.replyWithHTML(ctx.session.data.content_now, endOptions)
        ctx.reply('Введите значение на русском')
    } else {
        if (ctx.session.data.next) {
            await ctx.reply('Введите значение на русском')
        } else {
            await ctx.editMessageText('Введите значение на русском', endOptions)
        }
    }
}

const enterUA = async (ctx) => {
    if (ctx.session.data.next) {
        await ctx.reply('Введите значение на украинском')
    } else {
        await ctx.reply('Введите значение на украинском', endOptions)
    }
}

const value = async (ctx) => {
    ctx.session.data.lang = "ru"
    await ctx.session.data.save(ctx)
    .then(async ()=>{
        ctx.session.data.lang = "ua"
        await ctx.session.data.save(ctx)
    })
    .then(async ()=>{
        await ctx.reply('Изменения приняты')
        if(ctx.session.data.next){
            await ctx.session.data.next(ctx)
        } else {
            await ctx.scene.leave()
        }
    })
    .catch(async (err)=>{
        console.log(err)
        await ctx.reply(`Ошибка: ${err}`, endOptions)
    })
}

const valueRU = async (ctx) => {
    ctx.session.data.lang = "ru";
    await ctx.session.data.save(ctx)
    .then(async ()=>await ctx.reply('Изменения приняты'))
    .then(async ()=>await ctx.scene.enter('value_ua'))
    .catch(async (err)=>{
        console.log(err)
        await ctx.reply('Ошибка', endOptions)
    })
}

const valueUA = async (ctx) => {
    ctx.session.data.lang = "ua";
    await ctx.session.data.save(ctx)
    .then(async ()=>await ctx.reply('Изменения приняты'))
    .then(async ()=>{
        if(ctx.session.data.next){
            await ctx.session.data.next(ctx)
        } else {
            await ctx.scene.leave()
        }
    })
    .catch(async (err)=>{
        console.log(err)
        await ctx.reply('Ошибка', endOptions)
    })
}

const document = async (ctx) => {
    if(ctx.session.data.changed_field==='image'){
        if(ctx.update.message.document){
            const {file_id: fileId} = await ctx.update.message.document;
            await ctx.telegram.getFileLink(fileId)
            .then(async (path)=>{
                ctx.replay(path);
                ctx.message.text = path;
                await value(ctx);
            })
            .catch((err)=>{
                console.log(err);
                throw err;
            })
        } else {
            await ctx.reply('Отправте картинку без сжатия!')
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