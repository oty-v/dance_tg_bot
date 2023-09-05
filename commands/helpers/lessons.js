const {setData, setDataSubCollection, getPageContent, deleteDataSubCollection, uploadFileFromURL, deleteFile} = require('../../services/FirebaseController');

const saveLesson = async(ctx) => {
    const lang = ctx.session.data.lang;
    const changed_field = ctx.session.data.changed_field;
    const lesson_key = ctx.session.data.lesson_key;
    const lesson_id = ctx.session.data.lesson_id;
    const in_cards = ["image", "card_info", "number", "name"];
    const in_list = ["info", "price_info", "price", "time", "name"]
    if (changed_field==='image') {
        await uploadFileFromURL(ctx.message.text, '', lesson_id)
        .then(async (path)=>{
            ctx.message.text = path;
        })
        .catch((err)=>{
            console.log(err);
            throw err;
        })
    }
    const text = ctx.message.text;
    if (in_cards.includes(changed_field)) {
        await getPageContent('lessons', lang).then(async (oldContent) => {
            oldContent.cards[lesson_key][changed_field] = text;
            return await setData(lang, "lessons", oldContent)
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
    if (in_list.includes(changed_field)) {
        return await setDataSubCollection(lang, "lessons", lesson_id, {[changed_field]: text})
    }
}

const createLesson = async(ctx) => {
    const lang = ctx.session.data.lang;
    const oldContent = await getPageContent('lessons', lang);

    const maxLesson = oldContent
        .cards
        .reduce((prev, cur) => prev["document_id"] > cur["document_id"]
            ? prev
            : cur, {"document_id": undefined});
    const lesson_id = (maxLesson.document_id === undefined)
        ? 0
        : (+ maxLesson.document_id) + 1;

    const newCard = {
        document_id: lesson_id
    }

    oldContent
        .cards
        .push(newCard);
    return await setData(lang, "lessons", oldContent).then(async() => {
        return await setDataSubCollection(lang, "lessons", lesson_id, {})
    }).then(() => {
        return {
            id: lesson_id,
            key: oldContent.cards.length - 1
        }
    }).catch((res) => res)

}

const deleteLesson = async(ctx) => {
    const lesson_name = ctx.session.data.lesson;
    const old_content_ru = await getPageContent('lessons', 'ru');
    const old_content_ua = await getPageContent('lessons', 'ua');
    const lesson = old_content_ru
        .cards
        .find(card => card.name.toLowerCase() === lesson_name.toLowerCase());
        
    if (!!lesson.document_id) {
        await deleteFile(lesson.document_id);
    }
    const filtered_ru = old_content_ru
        .cards
        .filter(card => card.name.toLowerCase() !== lesson_name.toLowerCase());
    const filtered_ua = old_content_ua
        .cards
        .filter(card => card.document_id !== lesson.document_id);
    return await setData('ru', "lessons", {'cards': filtered_ru}).then(async() => {
        return await deleteDataSubCollection('ru', "lessons", lesson.document_id)
    }).then(async() => {
        return await setData('ua', "lessons", {'cards': filtered_ua})
    }).then(async() => {
        return await deleteDataSubCollection('ua', "lessons", lesson.document_id)
    }).catch((res) => res)
}

module.exports = {
    saveLesson,
    createLesson,
    deleteLesson
}