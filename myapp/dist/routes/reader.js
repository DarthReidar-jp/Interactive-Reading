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
const mongodb_1 = require("mongodb"); // MongoDBドライバーからObjectIdをインポート
const memo_1 = require("../models/memo");
const dbUtils_1 = require("../utils/dbUtils"); // getDBCollectionの実装がどこにあるかに基づいて適宜パスを修正してください
const openaiUtils_1 = require("../utils/openaiUtils");
const marked_1 = __importDefault(require("marked"));
const router = express_1.default.Router();
// 特定のBookの編集画面を表示
router.get('/:bookId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        // パラメータから取得したbookIdを使用してMongoDBのObjectIdを生成
        const objectId = new mongodb_1.ObjectId(bookId);
        const collection = yield (0, dbUtils_1.getDBCollection)('books');
        // 指定されたIDを持つBookをデータベースから検索
        const book = yield collection.findOne({ _id: objectId });
        if (book) {
            // マークダウンをHTMLに変換
            book.contentHtml = marked_1.default.parse(book.content);
            res.render('reader', { book });
        }
        else {
            // Bookが見つからない場合、404エラーを表示
            res.status(404).send('Book not found');
        }
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
// メモ作成のルーティング
router.post('/createMemo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const vector = yield (0, openaiUtils_1.getMemoVector)(content);
        // Memoの型が正確には不明ですが、ここでは適切な型を持つと仮定します。
        const memo = new memo_1.Memo(title, content, vector);
        const collection = yield (0, dbUtils_1.getDBCollection)('memos');
        yield collection.insertOne(memo);
        console.log('memoは保存されました');
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
