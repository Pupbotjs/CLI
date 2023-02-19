"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.js_template = void 0;
exports.js_template = `
const { PupPlugin, segment } = require('@pupbot/core')

const plugin = new PupPlugin('demo', '0.1.0')
//插件挂载
plugin.onMounted(() => {
  plugin.onMessage(event => {
    const { raw_message } = event
    if (raw_message === 'hello') { 
      const msgs = [segment.face(66), 'world']
      event.reply(msgs)
    }
  })
})

module.exports = { plugin }
`.trim();
