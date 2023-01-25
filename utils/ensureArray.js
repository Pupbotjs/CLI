"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureArray = void 0;
function ensureArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    else {
        return [value];
    }
}
exports.ensureArray = ensureArray;
