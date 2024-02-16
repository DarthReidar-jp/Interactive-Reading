"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.readJSONFile = void 0;
const fs_1 = __importDefault(require("fs"));
function readJSONFile(filePath) {
    const fileData = fs_1.default.readFileSync(filePath);
    return JSON.parse(fileData.toString());
}
exports.readJSONFile = readJSONFile;
function deleteFile(filePath) {
    fs_1.default.unlinkSync(filePath);
}
exports.deleteFile = deleteFile;
