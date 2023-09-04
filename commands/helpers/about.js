const { setData } = require('../../services/FirebaseController');

const saveAbout = async (ctx, session) => {
    return await setData(session.data.lang, "about", {"info": ctx.message.text})
}

module.exports = {
    saveAbout
}