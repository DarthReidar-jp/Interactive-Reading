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
// TypeScriptファイルであるため、拡張子を.tsに変更します。
const express_1 = __importDefault(require("express"));
const dbUtils_1 = require("../utils/dbUtils");
const mongodb_1 = require("mongodb");
const router = express_1.default.Router();
// フォルダ作成エンドポイント
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received request data:", req.body); // リクエストボディの内容をログ出力
    try {
        const { name, memoIds } = req.body;
        // リクエストデータの検証
        if (!name || !Array.isArray(memoIds) || memoIds.length === 0) {
            return res.status(400).send({ message: 'Invalid request data. Name and memoIds are required.' });
        }
        const foldersCollection = yield (0, dbUtils_1.getDBCollection)('folders');
        const memosCollection = yield (0, dbUtils_1.getDBCollection)('memos');
        // 新しいフォルダを作成
        const folder = { name, memoIds, createdAt: new Date() }; // createdAtを追加してフォルダ作成時間を記録
        const folderResult = yield foldersCollection.insertOne(folder);
        const folderId = folderResult.insertedId;
        // 対応するメモのfolderIdsにこのフォルダIDを追加
        yield Promise.all(memoIds.map(memoId => memosCollection.updateOne({ _id: new mongodb_1.ObjectId(memoId) }, { $push: { folderIds: folderId.toString() } })));
        res.status(201).send({ message: 'Folder created successfully', folderId: folderId });
    }
    catch (e) {
        if (e instanceof Error) {
            // eがErrorインスタンスである場合、そのmessageプロパティを使用
            console.error('Error creating folder:', e); // エラーログの詳細化
            res.status(500).send({ message: 'Internal Server Error', error: e.message });
        }
        else {
            // eがErrorインスタンスではない場合（文字列など）、toStringで変換
            res.status(500).send(String(e));
        }
    }
}));
// フォルダ内のメモ取得エンドポイント
router.get('/:folderId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { folderId } = req.params;
        const foldersCollection = yield (0, dbUtils_1.getDBCollection)('folders');
        const folders = yield foldersCollection.find({}).toArray();
        const memosCollection = yield (0, dbUtils_1.getDBCollection)('memos');
        const result = yield memosCollection.find({ folderIds: folderId }).toArray();
        res.render('display', { folders, memos: result }); // 結果を表示画面に再利用
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
