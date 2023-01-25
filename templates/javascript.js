"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.js_template = void 0;
exports.js_template = `
const { PupPlugin, segment, http } = require('@pupbot/core')

const plugin = new PupPlugin('demo', '0.1.0')
//插件被启用调用函数
plugin.onMounted(() => {
  plugin.onMessage(event => {
    const { raw_message } = event
//event为接收到的(消息/事件)对象
    if (raw_message === 'hello') {   //如果接受到的消息为hello，回复world
      const msgs = [segment.face(66), 'world']
      event.reply(msgs)
    }
  })
})

module.exports = { plugin }
`.trim();
