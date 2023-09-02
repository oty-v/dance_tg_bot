const { setData } = require('../../services/FirebaseController');

const saveAbout = async (ctx) => {
    return await setData(ctx.session.data.lang, "about", {"info": ctx.message.text})
}

module.exports = {
    saveAbout
}