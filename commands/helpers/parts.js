const {getSubPageContent, setDataSubCollection, deleteFile} = require("../../services/FirebaseController");
const { value } = require("./main");

const savePart = async(ctx, session) => {
    const lang = session.data.lang;
    const changed_field = session.data.changed_field;
    const lesson_id = session.data.lesson_id;
    const part_key = session.data.part_key;
    const part_id = session.data.part_id;
    if (session.data.changed_field==='image') {
        uploadFileFromURL(ctx.message.text, lesson_id, part_id)
        .then((path)=>{
            ctx.message.text = path;
            value(ctx);
        })
        .catch((err)=>{
            console.log(err);
            throw err;
        })
    }
    const text = ctx.message.text;
    getSubPageContent('lessons', lesson_id, lang).then((oldContent) => {
        if (oldContent.parts[part_key]) {
            oldContent.parts[part_key][changed_field] = text;
            setDataSubCollection(lang, "lessons", lesson_id, oldContent)
        }
    }).catch((err) => {
        console.log(err)
        return err;
    })
}

const createPart = async(session) => {
    const lang = session.data.lang;
    const lesson_id = session.data.lesson_id;
    const oldContent = await getSubPageContent('lessons', lesson_id, lang);

    if (oldContent.parts === undefined) {
        oldContent.parts = [];
    }

    const maxLesson = oldContent
        .parts
        .reduce((prev, cur) => prev["id"] > cur["id"]
            ? prev
            : cur, {"id": undefined});

    const part_id = (maxLesson.id === undefined)
        ? 0
        : (+ maxLesson.id) + 1;

    const newPart = {
        id: part_id
    }

    oldContent
        .parts
        .push(newPart);
    return setDataSubCollection(lang, "lessons", lesson_id, oldContent).then(() => {
        return {
            key: oldContent.parts.length - 1,
            id: oldContent.parts.id
        }
    }).catch((res) => res)

}

const deletePart = async(session) => {
    const lesson_id = session.data.lesson_id;
    const part_name = session.data.part;
    const res = await getSubPageContent('lessons', lesson_id)
    const old_content_ru = res.ru;
    const old_content_ua = res.ua;
    const part_key = old_content_ru
        .parts
        .findIndex((part) => part.name.toLowerCase() === part_name.toLowerCase());
    if (!!old_content_ru.parts[part_key].id) {
        deleteFile(lesson_id, old_content_ru.parts[part_key].id);
    }
    const filtered_ru = old_content_ru
        .parts
        .filter((part) => part.name.toLowerCase() !== part_name.toLowerCase());
    old_content_ua
        .parts
        .splice(part_key, 1);
    old_content_ru.parts = filtered_ru;

    return setDataSubCollection('ru', "lessons", lesson_id, old_content_ru).then(async() => {
        return setDataSubCollection('ua', "lessons", lesson_id, old_content_ua)
    }).catch((res) => res)
}

module.exports = {
    savePart,
    createPart,
    deletePart
}