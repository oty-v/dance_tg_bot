const { Scenes } = require('telegraf');
const { enter, enterRU, enterUA, valueUA, valueRU, value } = require('../commands/helpers');
const { document } = require('../commands/helpers/main');

const EnterValueScene = new Scenes.BaseScene('value');
const EnterValueRUScene = new Scenes.BaseScene('value_ru');
const EnterValueUAScene = new Scenes.BaseScene('value_ua');

EnterValueUAScene.enter(enterUA)
EnterValueUAScene.on('text', valueUA)

EnterValueRUScene.enter(enterRU)
EnterValueRUScene.on('text', valueRU)

EnterValueScene.enter(enter)
EnterValueScene.on('text', value)
EnterValueScene.on('message', document);

module.exports = {
    EnterValueScene,
    EnterValueRUScene,
    EnterValueUAScene
}