"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkModule = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = require("../path");
function checkModule(moduleName) {
    return fs_extra_1.default.existsSync(node_path_1.default.join(path_1.NodeModulesDir, moduleName));
}
exports.checkModule = checkModule;
