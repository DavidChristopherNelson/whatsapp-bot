"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTempFile = createTempFile;
exports.readBufferFromPath = readBufferFromPath;
exports.writeBufferToPath = writeBufferToPath;
exports.safeUnlink = safeUnlink;
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const crypto_1 = require("crypto");
async function createTempFile(prefix = 'wa_', ext = '.tmp') {
    const name = `${prefix}${(0, crypto_1.randomBytes)(6).toString('hex')}${ext}`;
    const filePath = (0, path_1.join)((0, os_1.tmpdir)(), name);
    await fs_1.promises.writeFile(filePath, Buffer.alloc(0));
    return filePath;
}
async function readBufferFromPath(path) {
    return fs_1.promises.readFile(path);
}
async function writeBufferToPath(path, data) {
    await fs_1.promises.writeFile(path, data);
}
async function safeUnlink(path) {
    try {
        await fs_1.promises.unlink(path);
    }
    catch {
    }
}
//# sourceMappingURL=audio.util.js.map