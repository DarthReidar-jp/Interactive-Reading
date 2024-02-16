"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFoldersAndMemos = exports.getAllMemos = exports.getAllFolders = void 0;
// dataFetchUtils.ts
const dbUtils_1 = require("./dbUtils");
function getAllFolders() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foldersCollection = yield (0, dbUtils_1.getDBCollection)('folders');
            const folders = yield foldersCollection.find({}).toArray();
            return { folders };
        }
        catch (e) {
            // エラーがErrorインスタンスかどうかをチェック
            if (e instanceof Error) {
                throw new Error(e.message);
            }
            else {
                throw new Error(String(e));
            }
        }
    });
}
exports.getAllFolders = getAllFolders;
function getAllMemos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const memosCollection = yield (0, dbUtils_1.getDBCollection)('memos');
            const memos = yield memosCollection.find({}).toArray();
            return { memos };
        }
        catch (e) {
            // エラーがErrorインスタンスかどうかをチェック
            if (e instanceof Error) {
                throw new Error(e.message);
            }
            else {
                throw new Error(String(e));
            }
        }
    });
}
exports.getAllMemos = getAllMemos;
function getAllFoldersAndMemos() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const foldersCollection = yield (0, dbUtils_1.getDBCollection)('folders');
            const folders = yield foldersCollection.find({}).toArray();
            const memosCollection = yield (0, dbUtils_1.getDBCollection)('memos');
            const memos = yield memosCollection.find({}).toArray();
            return { folders, memos };
        }
        catch (e) {
            // エラーがErrorインスタンスかどうかをチェック
            if (e instanceof Error) {
                throw new Error(e.message);
            }
            else {
                throw new Error(String(e));
            }
        }
    });
}
exports.getAllFoldersAndMemos = getAllFoldersAndMemos;
