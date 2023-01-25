"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const fs_extra_1 = __importStar(require("fs-extra"));
const prompts_1 = __importDefault(require("prompts"));
const path_1 = require("../path");
const base64_1 = require("../utils/base64");
const colors_1 = require("../utils/colors");
const __1 = require("..");
const install_1 = require("./install");
const notice_1 = require("../utils/notice");
const package_json_1 = require("../templates/package-json");
const start_1 = require("./start");
const DefaultNoticeConfig = {
    enable: true,
    friend: {
        request: {
            enable: true,
            action: 'ignore'
        },
        increase: true,
        decrease: true,
        message: false
    },
    group: {
        request: {
            enable: true,
            action: 'ignore'
        },
        increase: true,
        decrease: true,
        ban: true,
        admin: true,
        transfer: true
    }
};
const questions = [
    {
        name: 'account',
        type: 'text',
        message: 'Bot QQ 账号',
        validate: (input) => {
            return /^[1-9]\d{4,9}$/.test(input.trim()) ? true : '无效的 QQ 账号';
        },
        format: (e) => Number(e.trim())
    },
    {
        name: 'platform',
        type: 'select',
        message: '登录协议',
        initial: 0,
        choices: [
            {
                title: 'iPad（苹果平板，推荐，可多设备同时在线）',
                value: 5
            },
            {
                title: 'aPhone（安卓手机）',
                value: 1
            },
            {
                title: 'APad（安卓平板）',
                value: 2
            },
            {
                title: 'MacOS（苹果电脑）',
                value: 4
            },
            {
                title: 'aWatch（安卓手表）',
                value: 3
            }
        ]
    },
    {
        name: 'admins',
        type: 'list',
        message: 'Bot 管理员',
        separator: ' ',
        format: (list) => [...new Set(list.filter((e) => !!e).map(Number))],
        validate: (list) => {
            return /^[1-9]\d{4,9}(\s+[1-9]\d{4,9})*$/.test(list.trim()) ? true : '无效的管理员 QQ 账号';
        }
    },
    {
        name: 'login_mode',
        type: 'select',
        message: '登录模式',
        initial: 0,
        choices: [
            {
                title: '密码登录（推荐服务器使用）',
                value: 'password'
            },
            {
                title: '扫码登录（存在 IP 限制，推荐本地使用）',
                value: 'qrcode'
            }
        ]
    },
    {
        name: 'password',
        type: (login_mode) => {
            return login_mode === 'password' ? 'text' : null;
        },
        message: 'Bot 账号密码',
        style: 'password',
        validate: (password) => {
            return /^.{6,16}$/.test(password.trim()) ? true : '无效的密码';
        },
        format: (password) => password.trim()
    },
    {
        name: 'device_mode',
        type: (prev) => {
            return prev === 'qrcode' ? null : 'select';
        },
        initial: 0,
        message: '设备锁验证模式',
        choices: [
            {
                title: '短信验证码',
                value: 'sms'
            },
            {
                title: '二维码',
                value: 'qrcode'
            }
        ]
    }
];
async function init(args) {
    const isForce = args.force;
    const log_level = args.log_level;
    const needInstall = args.install;
    const needStart = args.start;
    if (!isForce && fs_extra_1.default.existsSync(path_1.ConfPath)) {
        notice_1.notice.warn('配置文件 `config.json` 已存在，加上 `--force` 进行覆盖');
        process.exit(0);
    }
    const answer = await (0, prompts_1.default)(questions);
    answer.password ?? (answer.password = '');
    answer.device_mode ?? (answer.device_mode = 'sms');
    if (!answer.login_mode || (answer.login_mode === 'password' && !answer.password)) {
        notice_1.notice.warn('退出 PupBot CLI');
        process.exit(0);
    }
    const isOK = writePupConf({
        account: answer.account,
        login_mode: answer.login_mode,
        device_mode: answer.device_mode,
        message_mode: 'short',
        password: (0, base64_1.base64encode)(answer.password),
        log_level: typeof log_level === 'string' ? log_level : 'info',
        admins: answer.admins,
        plugins: [],
        notice: DefaultNoticeConfig,
        oicq_config: {
            platform: answer.platform
        }
    });
    (0, fs_extra_1.writeFileSync)(path_1.AppPath, "require('@pupbot/core').start()");
    (0, fs_extra_1.writeFileSync)(path_1.PkgPath, package_json_1.pkg_template);
    const files = ['config.json', 'app.js', 'package.json'];
    if (isOK) {
        notice_1.notice.success(`创建文件: ${colors_1.colors.cyan(files.join(', '))}`);
        if (needInstall || needStart) {
            await (0, install_1.installDependencies)(install_1.pupDeps);
        }
        if (needStart) {
            process.off('SIGINT', __1.exitHandler);
            await (0, start_1.start)();
        }
    }
    else {
        notice_1.notice.error('配置文件和入口文件写入失败');
        process.exit(1);
    }
}
exports.init = init;
init.help = `
      init\t初始化框架，引导生成配置文件和入口文件`;
function writePupConf(conf) {
    try {
        fs_extra_1.default.writeJsonSync(path_1.ConfPath, conf, { spaces: 2 });
        return true;
    }
    catch {
        return false;
    }
}
