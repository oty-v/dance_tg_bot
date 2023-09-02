const pagesOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Об Авторе', callback_data: 'about'}],
            [{text: 'Курсы', callback_data: 'lessons'}],
            [{text: 'Уроки курса', callback_data: 'parts'}],
            [{text: 'Выйти', callback_data: 'end'}]
        ]
    })
}

const createPagesOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Курсы', callback_data: 'lessons'}],
            [{text: 'Уроки курса', callback_data: 'parts'}],
            [{text: 'Выйти', callback_data: 'end'}]
        ]
    })
}

const startOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Создать', callback_data: 'create'}],
            [{text: 'Редактировать', callback_data: 'edit'}],
            [{text: 'Удалить', callback_data: 'destroy'}]
        ]
    })
}

const endOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Выйти', callback_data: 'end'}]
        ]
    })
}

const lessonOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                {text: 'Название', callback_data: 'name'},
                {text: 'Картинка', callback_data: 'image'},
                {text: 'Номер', callback_data: 'number'}
            ],
            [
                {text: 'Цена', callback_data: 'price'},
                {text: 'Уроки', callback_data: 'parts'},
                {text: 'Время', callback_data: 'time'}
            ],
            [
                {text: 'Информация в карточке', callback_data: 'card_info'}
            ],
            [
                {text: 'Общая информация', callback_data: 'info'}
            ],
            [
                {text: 'Краткая информация', callback_data: 'price_info'}
            ],
            [{text: 'Выйти', callback_data: 'end'}]
        ]
    })
}

const partOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [
                {text: 'Название', callback_data: 'name'},
                {text: 'Общая информация', callback_data: 'info'},
                {text: 'Время', callback_data: 'time'}
            ],
            [
                {text: 'Картинка', callback_data: 'image'},
                {text: 'Номер', callback_data: 'number'}
            ],
            [{text: 'Выйти', callback_data: 'end'}]
        ]
    })
}

const skipOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Пропустить', callback_data: 'skip'}]
        ]
    })
}

module.exports = {
    pagesOptions,
    createPagesOptions,
    startOptions,
    endOptions,
    lessonOptions,
    partOptions,
    skipOptions
}