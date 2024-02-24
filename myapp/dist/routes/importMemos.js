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
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.post('/', upload.single('jsonFile'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // socket.ioで進行状況をクライアントに送信するための準備
    const io = req.app.get('io'); // app.tsで設定したsocket.ioインスタンスを取得
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        const collection = yield (0, dbUtils_1.getDBCollection)('memos');
        const fileData = fs_1.default.readFileSync(req.file.path, { encoding: 'utf-8' });
        const memos = JSON.parse(fileData);
        if (!Array.isArray(memos)) {
            throw new Error('Uploaded file must be an array of memos');
        }
        const validMemos = memos.filter(memo => memo.title && memo.content);
        // バッチ処理関数の定義
        function processBatch(batch) {
            return __awaiter(this, void 0, void 0, function* () {
                for (const memo of batch) {
                    const vector = yield (0, openaiUtils_1.getMemoVector)(memo.content);
                    yield collection.insertOne({
                        title: memo.title,
                        content: memo.content,
                        vector: vector
                    });
                }
            });
        }
        // バッチ処理を再帰的に呼び出す関数の中で進行状況を送信
        function processMemos(memos, startIndex = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                if (startIndex >= memos.length) {
                    if (req.file && req.file.path) {
                        fs_1.default.unlinkSync(req.file.path); // 処理が完了したらファイルを削除
                    }
                    res.redirect('/display');
                    return;
                }
                const batch = memos.slice(startIndex, startIndex + 1);
                yield processBatch(batch);
                io.emit("progress", { progress: Math.min(100, (startIndex + batch.length) / memos.length * 100) });
                setTimeout(() => processMemos(memos, startIndex + 1), 500);
            });
        }
        // メモのバッチ処理を開始
        yield processMemos(validMemos);
    }
    catch (e) {
        if (e instanceof Error) {
            res.status(500).send(e.message);
        }
        else {
            res.status(500).send(String(e));
        }
    }
}));
exports.default = router;
