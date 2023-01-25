"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fix = void 0;
const fs_extra_1 = require("fs-extra");
const fast_glob_1 = __importDefault(require("fast-glob"));
const node_path_1 = __importDefault(require("node:path"));
const path_1 = require("../path");
const notice_1 = require("../utils/notice");
function shuffleString(str) {
    return str
        .split('')
        .sort(() => (Math.random() > 0.5 ? 1 : -1))
        .join('');
}
async function fix(args) {
    const device = args.device;
    const deviceFile = args.deviceFile;
    if (device) {
        const oicqDevicePath = deviceFile || (await (0, fast_glob_1.default)('data/oicq/*/*.json'))?.[0];
        if (!oicqDevicePath) {
            notice_1.notice.error('设备文件不存在');
            process.exit(1);
        }
        const filePath = node_path_1.default.join(path_1.CWD, oicqDevicePath);
        try {
            const config = require(filePath);
            (0, fs_extra_1.writeJsonSync)(filePath, { ...config, imei: shuffleString(config?.imei || '') }, { spaces: 2 });
            notice_1.notice.success('成功修改设备描述文件的 IMEI');
        }
        catch {
            notice_1.notice.error('设备描述文件修改失败');
        }
    }
}
exports.fix = fix;
fix.help = `
      fix\t修复特定问题，--device 生成新 IMEI`;
