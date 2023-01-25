"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const prompts_1 = __importDefault(require("prompts"));
const node_path_1 = __importDefault(require("node:path"));
const checkModule_1 = require("../utils/checkModule");
const install_1 = require("./install");
const javascript_1 = require("../templates/javascript");
const notice_1 = require("../utils/notice");
const path_1 = require("../path");
const typescript_1 = require("../templates/typescript");
const create = async (args) => {
    const pluginName = args._[0];
    // 当前 node_modules 目录下是否已存在 TS 依赖
    const isTypescriptExist = (0, checkModule_1.checkModule)('typescript');
    const { lang, inputPluginName, needInstallTypescript } = await (0, prompts_1.default)([
        {
            type: pluginName ? null : 'text',
            name: 'inputPluginName',
            message: '插件名',
            initial: 'demo'
        },
        {
            type: 'select',
            name: 'lang',
            message: '开发语言',
            choices: [
                { title: 'JavaScript', value: 'JS' },
                { title: 'TypeScript', value: 'TS' }
            ],
            initial: 0
        },
        {
            type: (pre) => (pre === 'TS' && !isTypescriptExist ? 'confirm' : null),
            name: 'needInstallTypescript',
            message: '未检测到 TS 依赖，是否要为你安装?',
            initial: true
        }
    ]);
    const pname = pluginName ?? inputPluginName;
    const pluginDirPath = node_path_1.default.join(path_1.PluginDir, pname);
    if (fs_extra_1.default.existsSync(pluginDirPath)) {
        const { cover } = await (0, prompts_1.default)([
            {
                type: 'confirm',
                name: 'cover',
                message: `插件 ${pname} 已存在，是否覆盖？`,
                initial: false
            }
        ]);
        if (cover) {
            fs_extra_1.default.removeSync(pluginDirPath);
            notice_1.notice.info(`已删除: ${pluginDirPath}`);
        }
        else {
            notice_1.notice.success('已取消');
            process.exit(0);
        }
    }
    // 确保插件目录存在
    fs_extra_1.default.ensureDirSync(pluginDirPath);
    if (lang === 'TS') {
        try {
            fs_extra_1.default.writeFileSync(node_path_1.default.join(pluginDirPath, 'index.ts'), typescript_1.ts_template);
            fs_extra_1.default.writeFileSync(node_path_1.default.join(pluginDirPath, 'tsconfig.json'), typescript_1.ts_config);
        }
        catch {
            notice_1.notice.error('文件写入失败');
            process.exit(1);
        }
        if (needInstallTypescript) {
            await (0, install_1.installDependencies)('typescript');
        }
    }
    else if (lang === 'JS') {
        try {
            fs_extra_1.default.writeFileSync(node_path_1.default.join(pluginDirPath, 'index.js'), javascript_1.js_template);
        }
        catch {
            notice_1.notice.error('文件写入失败');
            process.exit(1);
        }
    }
    notice_1.notice.success(`已创建: ${pluginDirPath}`);
};
exports.create = create;
exports.create.help = `
      create\t初始化插件开发模板 (JS/TS)`;
