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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const openaiUtils_1 = require("../utils/openaiUtils");
const dbUtils_1 = require("../utils/dbUtils");
const router = express_1.default.Router();
// アップロードされたファイルを一時的に保存するディレクトリ
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// JSONインポート機能のルート
router.post('/', upload.single('jsonFile'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const collection = yield (0, dbUtils_1.getDBCollection)('memos');
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        const fileData = fs_1.default.readFileSync(req.file.path, { encoding: 'utf-8' });
        const memos = JSON.parse(fileData);
        // データ検証を行う
        if (!Array.isArray(memos)) {
            throw new Error('Uploaded file must be an array of memos');
        }
        const validMemos = memos.filter(memo => memo.title && memo.content);
        if (validMemos.length !== memos.length) {
            throw new Error('Some memos are missing a title or content');
        }
        // データベースにメモを保存
        yield Promise.all(validMemos.map((memo) => __awaiter(void 0, void 0, void 0, function* () {
            // Memoモデルに従って新しいメモを作成
            yield collection.insertOne({
                title: memo.title,
                content: memo.content,
                // ベクトルデータが必要な場合はここで生成
                vector: yield (0, openaiUtils_1.getMemoVector)(memo.content)
            });
        })));
        fs_1.default.unlinkSync(req.file.path); // アップロードされたファイルを削除
        res.redirect('/display');
    }
    catch (e) {
        if (e instanceof Error) {
            // eがErrorインスタンスである場合、そのmessageプロパティを使用
            res.status(500).send(e.message);
        }
        else {
            // eがErrorインスタンスではない場合（文字列など）、toStringで変換
            res.status(500).send(String(e));
        }
    }
}));
exports.default = router;
