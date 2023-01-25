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
exports.exitHandler = void 0;
const minimist_1 = __importDefault(require("minimist"));
const node_path_1 = __importDefault(require("node:path"));
const colors_1 = require("./utils/colors");
const cmds = __importStar(require("./commands"));
const versionCheck_1 = require("./utils/versionCheck");
const notice_1 = require("./utils/notice");
const pkg = require(node_path_1.default.join(__dirname, '../package.json'));
const args = (0, minimist_1.default)(process.argv.slice(2));
const firstCmd = args._[0];
const inputCmd = firstCmd === 'delete' ? 'del' : firstCmd;
const Head = `PupBot CLI v${pkg.version}\n\n`;
const HelpHead = `用法：pup <命令> [选项]\n\n命令列表：`;
const exitHandler = () => {
    process.stdout.write(colors_1.colors.yellow('\n已退出 PupBot CLI'));
    process.exit(0);
};
exports.exitHandler = exitHandler;
const cli = async () => {
    /** 捕获 Ctrl C 中断退出 */
    process.on('SIGINT', exports.exitHandler);
    if (args.v || args.version) {
        return console.log(pkg.version);
    }
    if (!inputCmd || !Object.keys(cmds).includes(inputCmd)) {
        const helps = Object.values(cmds).map((e) => e.help);
        console.log('\n' + Head + HelpHead + helps.join('') + '\n');
    }
    else {
        try {
            args._.shift();
            if (args.debug) {
                (0, versionCheck_1.versionCheck)();
            }
            const res = cmds[inputCmd](args);
            if (res instanceof Promise)
                await res;
        }
        catch (e) {
            console.log(e);
            notice_1.notice.error('CLI 执行遇到错误，参考上面输出的日志');
        }
    }
};
cli();
