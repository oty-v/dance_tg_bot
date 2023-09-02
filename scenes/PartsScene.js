const { Scenes } = require('telegraf');
const { enter, identifier, text, number } = require('../commands/parts');

const PartsScene = new Scenes.BaseScene('parts');

PartsScene.enter(enter)
PartsScene.on('text', identifier)

PartsScene.action('name', (ctx)=>text('name',ctx))
PartsScene.action('time', (ctx)=>text('time',ctx))
PartsScene.action('info', (ctx)=>text('info',ctx))
PartsScene.action('url', (ctx)=>number('url',ctx))
PartsScene.action('number', (ctx)=>number('number',ctx))
PartsScene.action('image', (ctx)=>number('image',ctx))


module.exports = {
    PartsScene
}