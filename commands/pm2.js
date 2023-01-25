"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.del = exports.log = exports.stop = exports.deploy = void 0;
const node_os_1 = __importDefault(require("node:os"));
const node_child_process_1 = require("node:child_process");
const checkModule_1 = require("../utils/checkModule");
const _src_1 = require("../index");
const getCurrentAccount_1 = require("../utils/getCurrentAccount");
const install_1 = require("./install");
const notice_1 = require("../utils/notice");
const promiseExec_1 = require("../utils/promiseExec");
const isWin = node_os_1.default.platform() === 'win32';
const npx = isWin ? 'npx.cmd' : 'npx';
async function pm2(operation, force = false) {
    if (!(0, checkModule_1.checkModule)('pm2')) {
        await (0, install_1.installDependencies)('pm2');
    }
    const account = (0, getCurrentAccount_1.getCurrentAccount)();
    const pm2Args = [npx, 'pm2', operation, 'app.js', '--name', account];
    if (force) {
        pm2Args.push('-f');
    }
    try {
        await (0, promiseExec_1.promiseExec)(pm2Args.join(' '));
        return true;
    }
    catch (e) {
        console.log((e?.stderr || e).trim());
        return false;
    }
}
async function pm2Spawn(opt = 'log') {
    if (!(0, checkModule_1.checkModule)('pm2')) {
        await (0, install_1.installDependencies)('pm2');
    }
    process.off('SIGINT', _src_1.exitHandler);
    const account = opt === 'log' ? (0, getCurrentAccount_1.getCurrentAccount)() : '';
    const pm2 = (0, node_child_process_1.spawn)(npx, ['pm2', opt, account], { stdio: 'inherit' });
    pm2.on('error', (err) => console.error(err));
    pm2.stdout?.on('data', (data) => console.log(data.toString()));
    pm2.stderr?.on('data', (data) => console.error(data.toString()));
}
async function deploy(args) {
    const res = await pm2('start', args.f);
    if (res) {
        notice_1.notice.info(`已尝试使用 pm2 将 PupBot 进程部署在后台`);
    }
    else {
        notice_1.notice.error(`操作失败，参考上面的错误日志`);
    }
}
exports.deploy = deploy;
deploy.help = `
      deploy\t使用 pm2 将 PupBot 进程部署在后台`;
async function stop(args) {
    const res = await pm2('stop', args.f);
    if (res) {
        notice_1.notice.info(`已尝试停止 pm2 的 PupBot 后台进程`);
    }
    else {
        notice_1.notice.error(`操作失败，参考上面的错误日志`);
    }
}
exports.stop = stop;
stop.help = `
      stop\t停止 pm2 后台的 PupBot 进程`;
async function log() {
    await pm2Spawn();
}
exports.log = log;
log.help = `
      log\t查看 pm2 后台的 PupBot 日志`;
async function del(args) {
    const res = await pm2('delete', args.f);
    if (res) {
        notice_1.notice.info(`已尝试删除 pm2 的 PupBot 后台进程`);
    }
    else {
        notice_1.notice.error(`操作失败，参考上面的错误日志`);
    }
}
exports.del = del;
del.help = `
      delete\t删除 pm2 后台的 PupBot 进程，需先停止`;
async function list() {
    await pm2Spawn('list');
}
exports.list = list;
list.help = `
      list\t查看 pm2 后台进程列表`;
