const { Scenes } = require('telegraf');
const { enter, identifier, text, number } = require('../commands/lessons');

const LessonsScene = new Scenes.BaseScene('lessons');

LessonsScene.enter(enter)

LessonsScene.on('text', identifier)

LessonsScene.action('name', (ctx)=>text('name',ctx))
LessonsScene.action('time', (ctx)=>text('time',ctx))
LessonsScene.action('info', (ctx)=>text('info',ctx))
LessonsScene.action('card_info', (ctx)=>text('card_info',ctx))
LessonsScene.action('price_info', (ctx)=>text('price_info',ctx))
LessonsScene.action('number', (ctx)=>number('number',ctx))
LessonsScene.action('image', (ctx)=>number('image',ctx))
LessonsScene.action('price', (ctx)=>number('price',ctx))


module.exports = {
    LessonsScene
}