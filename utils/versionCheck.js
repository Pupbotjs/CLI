"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versionCheck = exports.getCliVersion = void 0;
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = __importDefault(require("node:path"));
const notice_1 = require("./notice");
const colors_1 = require("./colors");
function getCliVersion() {
    return require(node_path_1.default.join(__dirname, '../../package.json')).version;
}
exports.getCliVersion = getCliVersion;
function versionCheck() {
    const nodeInfo = process.versions.node;
    const nodeMajorVersion = nodeInfo.split('.')[0];
    if (Number(nodeMajorVersion) < 14) {
        notice_1.notice.warn(`要求 node 最低版本为 14，当前为 ${nodeMajorVersion}，请升级 node 版本`);
        process.exit(0);
    }
    const ver = getCliVersion();
    const platform = node_os_1.default.platform();
    const env = `node: ${nodeInfo} | arch: ${platform}-${node_os_1.default.arch()}`;
    notice_1.notice.info(colors_1.colors.gray(`PupBot CLI ${ver} | ${env}`));
}
exports.versionCheck = versionCheck;
