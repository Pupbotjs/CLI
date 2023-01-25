"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = exports.installDependencies = exports.pupDeps = void 0;
const node_child_process_1 = require("node:child_process");
const node_util_1 = require("node:util");
const ora_1 = __importDefault(require("ora"));
const colors_1 = require("../utils/colors");
const ensureArray_1 = require("../utils/ensureArray");
const notice_1 = require("../utils/notice");
const loading = (0, ora_1.default)();
exports.pupDeps = ['@pupbot/core@latest'];
async function installDependencies(_deps = []) {
    const promiseExec = (0, node_util_1.promisify)(node_child_process_1.exec);
    const modules = (0, ensureArray_1.ensureArray)(_deps);
    const mds = colors_1.colors.cyan(modules.map((mod) => mod).join(', '));
    const mdsStr = mds ? ` ${mds} ` : '';
    loading.start(`正在安装${mdsStr}`);
    const cmd = `npm i ${modules.join(' ')} --registry https://registry.npmmirror.com`;
    const { stderr } = await promiseExec(cmd);
    if (stderr) {
        if (/npm ERR/i.test(String(stderr))) {
            loading.stop();
            notice_1.notice.warn(`${mdsStr}安装失败，npm 输出如下: `);
            console.log(stderr);
            notice_1.notice.error(`${mdsStr}安装失败`);
            return false;
        }
    }
    loading.succeed(`${mdsStr}安装成功`);
    return true;
}
exports.installDependencies = installDependencies;
async function install(args) {
    const modules = args._.length ? args._ : exports.pupDeps;
    await installDependencies(modules);
}
exports.install = install;
install.help = `
      install\t安装 node 依赖`;
