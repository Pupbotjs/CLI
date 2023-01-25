"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentAccount = void 0;
const path_1 = require("../path");
function getCurrentAccount() {
    const pupConf = require(path_1.ConfPath);
    return String(pupConf?.account ?? '');
}
exports.getCurrentAccount = getCurrentAccount;
