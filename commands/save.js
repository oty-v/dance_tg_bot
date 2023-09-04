const { getSession } = require("../services/MongoDBController");
const { saveAbout } = require("./helpers/about");
const { saveLesson } = require("./helpers/lessons");
const { savePart } = require("./helpers/parts");

const save = async (name, ctx) => {
    const session = getSession(ctx.chat.id);
    switch (name) {
        case 'about':
          return saveAbout(ctx, session);
        case 'lessons':
            return saveLesson(ctx, session);
        case 'parts':
            return savePart(ctx, session);
        default:
          console.log(`Sorry, we are out of ${name}.`);
      }
}

module.exports = save;