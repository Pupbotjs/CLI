"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const node_child_process_1 = require("node:child_process");
const __1 = require("..");
const install_1 = require("./install");
const checkModule_1 = require("../utils/checkModule");
async function start() {
    if (!(0, checkModule_1.checkModule)('@pupbot/core')) {
        await (0, install_1.installDependencies)(install_1.pupDeps);
    }
    process.off('SIGINT', __1.exitHandler);
    const node = (0, node_child_process_1.spawn)('node', ['app.js'], { stdio: 'inherit' });
    node.stdout?.on('data', (data) => console.log(data.toString()));
    node.stderr?.on('data', (data) => console.error(data.toString()));
    node.on('error', (err) => console.error(err));
}
exports.start = start;
start.help = `
      start\t使用 \`config.json\` 配置文件启动 PupBot`;
