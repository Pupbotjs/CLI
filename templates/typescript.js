"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ts_template = exports.ts_config = void 0;
exports.ts_config = `
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
`.trim();
exports.ts_template = `
import { PupPlugin, segment, http } from '@pupbot/core'

const plugin = new PupPlugin('demo', '0.1.0')

plugin.onMounted(() => {
  plugin.onMessage(event => {
    const { raw_message } = event

    if (raw_message === 'hello') {
      const msgs = [segment.face(66), 'world']
      event.reply(msgs)
    }
  })
})

export { plugin }
`.trim();
