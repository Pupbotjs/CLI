"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const axios_1 = __importDefault(require("axios"));
const npm_check_updates_1 = __importDefault(require("npm-check-updates"));
const ora_1 = __importDefault(require("ora"));
const node_path_1 = __importDefault(require("node:path"));
const colors_1 = require("../utils/colors");
const path_1 = require("../path");
const versionCheck_1 = require("../utils/versionCheck");
const notice_1 = require("../utils/notice");
const promiseExec_1 = require("../utils/promiseExec");
const loading = (0, ora_1.default)();
async function getLatestVersion(module) {
    const api = `https://registry.npmjs.org/${module}`;
    const accept = 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*';
    const { data } = await axios_1.default.get(api, { headers: { accept } });
    const vs = Object.keys(data?.versions);
    return vs.length ? vs[vs.length - 1] : '';
}
async function update() {
    loading.start(`正在检查 PupBot CLI 更新...`);
    const lv = await getLatestVersion('pupbot');
    if (lv !== (0, versionCheck_1.getCliVersion)()) {
        loading.stop();
        const updateCmd = 'npm up -g pupbot';
        notice_1.notice.warn(colors_1.colors.gray(`PupBot CLI ${lv} 已发布，你可以通过以下命令进行更新:`));
        console.log(colors_1.colors.cyan(updateCmd));
    }
    loading.start(`正在安装依赖...`);
    try {
        const upInfo = await (0, npm_check_updates_1.default)({
            packageFile: node_path_1.default.join(path_1.CWD, 'package.json'),
            filter: ['@pupbot/*', 'pupbot', 'pupbot-*'],
            upgrade: true,
            jsonUpgraded: true
        });
        const npmUpCmd = `npm up`;
        const { stderr } = await (0, promiseExec_1.promiseExec)(npmUpCmd);
        if (stderr) {
            if (/npm ERR/i.test(String(stderr))) {
                loading.fail(`发生错误：`);
                console.log(stderr);
                loading.fail(`更新失败，参考上面的错误日志`);
                return false;
            }
        }
        if (upInfo) {
            const info = Object.entries(upInfo)
                .map((k, v) => `${k} => ${v}`)
                .join('\n');
            loading.succeed(info || '已是最新');
        }
    }
    catch (e) {
        loading.fail(`发生错误：`);
        console.log(e);
        loading.fail(`更新失败，参考上面的错误日志`);
    }
}
exports.update = update;
update.help = `
      update\t更新 PupBot 框架和插件依赖`;
